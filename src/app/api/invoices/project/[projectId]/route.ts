import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {

    const { projectId } = await params;

    const invoices = await prisma.invoice.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invoices);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );

  }
}