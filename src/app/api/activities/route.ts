import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET ACTIVITIES
export async function GET(req: Request) {
  try {

    const { searchParams } = new URL(req.url);

    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const activities =
      await prisma.activity.findMany({

        where: {
          taskId,
        },

        orderBy: {
          createdAt: "desc",
        },

      });

    return NextResponse.json(activities);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch activities",
      },
      {
        status: 500,
      }
    );

  }
}