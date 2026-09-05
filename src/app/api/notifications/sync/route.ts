import { NextRequest, NextResponse } from "next/server";
import { generateNotifications } from "@/lib/notifications";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("=================================");
    console.log("NOTIFICATION SYNC CALLED");
    console.log("USER ID:", body.userId);

    if (!body.userId) {
      return NextResponse.json(
        {
          error: "userId is required",
        },
        {
          status: 400,
        }
      );
    }

    await generateNotifications(
      body.userId
    );

    console.log(
      "NOTIFICATION SYNC COMPLETED"
    );
    console.log("=================================");

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {

    console.error(
      "================================="
    );

    console.error(
      "NOTIFICATION SYNC ERROR"
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(
      "Code:",
      error?.code
    );

    console.error(
      "Meta:",
      error?.meta
    );

    console.error(
      "Stack:",
      error?.stack
    );

    console.error(
      "================================="
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to generate notifications",

        code:
          error?.code || null,

        meta:
          error?.meta || null,
      },
      {
        status: 500,
      }
    );
  }
}