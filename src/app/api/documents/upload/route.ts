import { writeFile, mkdir } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    // CREATE UPLOADS DIRECTORY SAFELY
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    await mkdir(uploadDir, {
      recursive: true,
    });

    const fileName =
      Date.now() + "-" + file.name;

    const filePath = path.join(
      uploadDir,
      fileName
    );

    await writeFile(filePath, buffer);

    const document =
      await prisma.document.create({
        data: {
          name,
          fileUrl: `/uploads/${fileName}`,
        },
      });

    return NextResponse.json(document);
  } catch (error) {
    console.error(
      "UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        error: "Upload failed",
      },
      { status: 500 }
    );
  }
}