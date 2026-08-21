import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        {
          error: "Document id is required",
        },
        {
          status: 400,
        }
      );
    }

    const document = await prisma.document.update({
      where: {
        id: body.id,
      },

      data: {
        name: body.name,
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

    if (!body.id) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    await prisma.document.delete({
      where: {
        id: body.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE DOCUMENT ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
