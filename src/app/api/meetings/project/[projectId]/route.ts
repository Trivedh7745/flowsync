import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {

    const { projectId } = await params;

    const meetings = await prisma.meeting.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(meetings);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch meetings" },
      { status: 500 }
    );

  }
}