import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        {
          error: "Notification id is required",
        },
        {
          status: 400,
        }
      );
    }

    const notification =
      await prisma.notification.update({
        where: {
          id: body.id,
        },
        data: {
          read: true,
        },
      });

    return NextResponse.json(notification);
  } catch (error) {
    console.error(
      "MARK NOTIFICATION READ ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to mark notification as read",
      },
      {
        status: 500,
      }
    );
  }
}