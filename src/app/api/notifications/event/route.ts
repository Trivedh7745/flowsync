import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      userId,
      key,
      type,
      title,
      message,
      entityType,
      entityId,
      priority,
    } = body;

    if (!userId || !key || !type || !title || !message) {
      return NextResponse.json(
        {
          error: "Missing required notification fields.",
        },
        {
          status: 400,
        }
      );
    }

    const notification =
      await prisma.notification.create({
        data: {
          userId,
          key,
          type,
          title,
          message,
          entityType: entityType ?? null,
          entityId: entityId ?? null,
          priority: priority ?? "info",
        },
      });

    return NextResponse.json(
      notification,
      { status: 201 }
    );
  } catch (error: any) {
    // Notification with the same userId + key
    // already exists.
    if (error?.code === "P2002") {
      return NextResponse.json(
        {
          success: true,
          alreadyExists: true,
        },
        {
          status: 200,
        }
      );
    }

    console.error(
      "EVENT NOTIFICATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create notification.",
      },
      {
        status: 500,
      }
    );
  }
}