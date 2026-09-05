import { NextResponse } from "next/server";
import path from "path";
import { Readable } from "stream";
import { createClient } from "@supabase/supabase-js";
import {
  SlidesApi,
  ExportFormat,
} from "asposeslidescloud";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// SUPABASE SERVER CLIENT
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

export async function POST(req: Request) {
  try {
   
    const formData =
      await req.formData();

    const name =
      formData.get("name") as string;

    const file =
      formData.get("file") as File;

    const userId =
      formData.get("userId") as string;

    const clientId =
      formData.get("clientId") as string;

    const projectId =
      formData.get("projectId") as string;

    // VALIDATION
    if (!name || !file || !userId) {
      return NextResponse.json(
        {
          error: "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    // GET FILE DATA
    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    // EXTRACT FILE EXTENSION
    const fileExtension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "unknown";

    // CREATE UNIQUE FILE NAME
    const timestamp =
      Date.now();

    const fileName =
      `${timestamp}-${file.name}`;

    // STORAGE PATH
    const storagePath =
      `users/${userId}/${fileName}`;

    // =====================================
    // UPLOAD ORIGINAL FILE TO SUPABASE
    // =====================================

    const {
      error: uploadError,
    } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(
        storagePath,
        buffer,
        {
          contentType:
            file.type ||
            "application/octet-stream",

          upsert: false,
        }
      );

    if (uploadError) {
      console.error(
        "SUPABASE UPLOAD ERROR:",
        uploadError
      );

      throw new Error(
        uploadError.message
      );
    }

    // GET PERMANENT PUBLIC URL
    const {
      data: fileUrlData,
    } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    const fileUrl =
      fileUrlData.publicUrl;

    let previewUrl:
      | string
      | null = null;

    // =====================================
    // PPT / PPTX → PDF PREVIEW
    // =====================================

    if (
      fileExtension === "ppt" ||
      fileExtension === "pptx"
    ) {
      try {
        // ASPOSE CREDENTIALS
const ASPOSE_CLIENT_ID =
  process.env.ASPOSE_CLIENT_ID;

const ASPOSE_CLIENT_SECRET =
  process.env.ASPOSE_CLIENT_SECRET;

if (
  !ASPOSE_CLIENT_ID ||
  !ASPOSE_CLIENT_SECRET
) {
  throw new Error(
    "Aspose credentials are not configured"
  );
}
        console.log(
          "STARTING PPTX CONVERSION"
        );

        const slidesApi =
          new SlidesApi(
            ASPOSE_CLIENT_ID,
            ASPOSE_CLIENT_SECRET
          );

        // CREATE STREAM FROM UPLOADED BUFFER
        const presentationStream =
          Readable.from(buffer);

        const pdfResponse =
          await slidesApi.convert(
            presentationStream,
            ExportFormat.Pdf
          );

        const originalName =
          path.parse(file.name).name;

        const pdfFileName =
          `${timestamp}-${originalName}.pdf`;

        const previewStoragePath =
          `users/${userId}/previews/${pdfFileName}`;

        // UPLOAD CONVERTED PDF
        const {
          error: previewUploadError,
        } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(
            previewStoragePath,
            Buffer.from(
              pdfResponse.body
            ),
            {
              contentType:
                "application/pdf",

              upsert: false,
            }
          );

        if (previewUploadError) {
          throw new Error(
            previewUploadError.message
          );
        }

        // GET PDF PREVIEW URL
        const {
          data: previewUrlData,
        } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(
            previewStoragePath
          );

        previewUrl =
          previewUrlData.publicUrl;

        console.log(
          "PPTX PREVIEW CONVERSION SUCCESS"
        );
      } catch (conversionError) {
        // IMPORTANT:
        // ORIGINAL PPT/PPTX IS ALREADY UPLOADED.
        // DO NOT FAIL THE ENTIRE DOCUMENT UPLOAD.

        console.error(
          "PPTX PREVIEW CONVERSION FAILED:",
          conversionError
        );

        previewUrl = null;
      }
    }

    // =====================================
    // CREATE DATABASE RECORD
    // =====================================
    const document =
  await prisma.document.create({
    data: {
      name,

      fileUrl,

      fileType:
        fileExtension,

      fileSize:
        file.size || null,

      userId,

      clientId:
        clientId || null,

      projectId:
        projectId || null,

      previewUrl,
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

// ================================
// DOCUMENT CREATED NOTIFICATION
// ================================

await prisma.notification
  .create({
    data: {
      userId:
        document.userId,

      key:
        `document-${document.id}-created`,

      type:
        "document_created",

      title:
        "Document Added",

      message:
        `Document "${document.name}" has been added successfully.`,

      entityType:
        "document",

      entityId:
        document.id,

      priority:
        "info",
    },
  })
  .catch((error: any) => {
    // Ignore duplicate notification
    if (error?.code !== "P2002") {
      throw error;
    }
  });

return NextResponse.json(
  document,
  {
    status: 201,
  }
);
  } catch (error) {
    console.error(
      "UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}