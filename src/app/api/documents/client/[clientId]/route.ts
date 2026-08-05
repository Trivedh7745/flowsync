import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {

    const { clientId } = await params;

    const documents = await prisma.document.findMany({
      where: {
        clientId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(documents);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}