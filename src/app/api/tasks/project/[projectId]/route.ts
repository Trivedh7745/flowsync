import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {

    const { projectId } = await params;

    const tasks = await prisma.task.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tasks);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );

  }
}