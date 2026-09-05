import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    await prisma.notification.create({
      data: {
        userId: body.userId,

        key: `welcome-${body.userId}`,

        type: "welcome",

        title: "Welcome to FlowSync",

        message:
          "Manage your clients, create projects and tasks, share invoices, create or join meetings, and track project deadlines—all in one place.",

        priority: "info",
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    // Already exists
    if (error?.code === "P2002") {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
      });
    }

    console.error(
      "WELCOME NOTIFICATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create welcome notification",
      },
      { status: 500 }
    );
  }
}