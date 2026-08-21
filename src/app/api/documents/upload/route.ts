import { writeFile, mkdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;
    const clientId = formData.get("clientId") as string;

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

    // PREVENT FILE NAME CONFLICTS
    const fileName =
      `${Date.now()}-${file.name}`;

    const filePath = path.join(
      uploadDir,
      fileName
    );

    // SAVE FILE
    await writeFile(
      filePath,
      buffer
    );

    // CREATE DOCUMENT RECORD

const projectId =
  formData.get("projectId") as string;

    const document =
      await prisma.document.create({
        data: {
          name,
          fileUrl: `/uploads/${fileName}`,
          fileType: file.type || null,
          fileSize: file.size || null,
          userId,
          clientId: clientId || null,
          projectId: projectId || null,
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
        error: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}