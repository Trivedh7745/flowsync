import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { createClient } from "@supabase/supabase-js";

// GET DOCUMENTS
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const documents = await prisma.document.findMany({
      where: {
        userId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("GET DOCUMENTS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

// CREATE DOCUMENT
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const document = await prisma.document.create({
      data: {
        name: body.name,
        fileUrl: body.fileUrl,
        fileType: body.fileType,
        fileSize: body.fileSize ?? null,
        userId: body.userId,
        clientId: body.clientId || null,
        projectId: body.projectId || null,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("CREATE DOCUMENT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}

// UPDATE DOCUMENT
export async function PUT(req: Request) {
  try {
    const formData = await req.formData();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const clientId = formData.get("clientId") as string;
    const projectId = formData.get("projectId") as string;
    const file = formData.get("file") as File | null;

    if (!id) {
      return NextResponse.json(
        {
          error: "Document id is required",
        },
        {
          status: 400,
        }
      );
    }

    // Data that will be updated
    const updateData: any = {
      name,
      clientId: clientId || null,
      projectId: projectId || null,
    };

    // ONLY REPLACE FILE IF USER SELECTED A NEW ONE
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // CREATE UPLOAD DIRECTORY
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads"
      );

      await mkdir(uploadDir, {
        recursive: true,
      });

      // CREATE UNIQUE FILE NAME
      const fileName = `${Date.now()}-${file.name}`;

      const filePath = path.join(
        uploadDir,
        fileName
      );

      // SAVE NEW FILE
      await writeFile(
        filePath,
        buffer
      );

      // GET FILE EXTENSION
      const fileExtension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() || "unknown";

      // UPDATE FILE INFORMATION
      updateData.fileUrl = `/uploads/${fileName}`;
      updateData.fileType = fileExtension;
      updateData.fileSize = file.size;

      console.log("NEW DOCUMENT FILE SAVED:", {
        fileName,
        fileSize: file.size,
        fileUrl: updateData.fileUrl,
      });
    }

    // UPDATE EXISTING DOCUMENT
    const document = await prisma.document.update({
      where: {
        id,
      },

      data: updateData,

      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },

        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(document);

  } catch (error) {
    console.error("DOCUMENT UPDATE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to update document",
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE DOCUMENT
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Supabase environment variables are not configured"
  );
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

const BUCKET_NAME = "Documents";

    if (!body.id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // =====================================
    // 1. GET DOCUMENT BEFORE DELETING
    // =====================================

    const document = await prisma.document.findUnique({
      where: {
        id: body.id,
      },
      select: {
        id: true,
        fileUrl: true,
        previewUrl: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // =====================================
    // 2. EXTRACT STORAGE PATH FROM URL
    // =====================================

    const getStoragePath = (url: string) => {
      const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;

      const index = url.indexOf(marker);

      if (index === -1) {
        return null;
      }

      return decodeURIComponent(
        url.substring(index + marker.length)
      );
    };

    const filesToDelete: string[] = [];

    // ORIGINAL FILE
    if (document.fileUrl) {
      const filePath = getStoragePath(
        document.fileUrl
      );

      if (filePath) {
        filesToDelete.push(filePath);
      }
    }

    // PPT/PPTX PDF PREVIEW
    if (document.previewUrl) {
      const previewPath = getStoragePath(
        document.previewUrl
      );

      if (previewPath) {
        filesToDelete.push(previewPath);
      }
    }

    // =====================================
    // 3. DELETE FILES FROM SUPABASE STORAGE
    // =====================================

    if (filesToDelete.length > 0) {
      const {
        error: storageDeleteError,
      } = await supabase.storage
        .from(BUCKET_NAME)
        .remove(filesToDelete);

      if (storageDeleteError) {
        console.error(
          "SUPABASE STORAGE DELETE ERROR:",
          storageDeleteError
        );

        throw new Error(
          storageDeleteError.message
        );
      }
    }

    // =====================================
    // 4. DELETE DATABASE RECORD
    // =====================================

    await prisma.document.delete({
      where: {
        id: body.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE DOCUMENT ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete document",
      },
      {
        status: 500,
      }
    );
  }
}