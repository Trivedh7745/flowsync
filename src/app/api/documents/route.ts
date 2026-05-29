import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET DOCUMENTS
export async function GET() {
  try {
    const documents =
      await prisma.document.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return Response.json(documents);
  } catch (error) {
    console.error(error);

    return Response.json([]);
  }
}

// CREATE DOCUMENT
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const document =
      await prisma.document.create({
        data: {
          name: body.name,
          fileUrl: body.fileUrl,
        },
      });

    return NextResponse.json(document);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create document" },
      { status: 500 }
    );
  }
}

// DELETE DOCUMENT
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    await prisma.document.delete({
      where: {
        id: body.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}