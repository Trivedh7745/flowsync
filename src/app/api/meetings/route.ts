import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// =====================================
// GET MEETINGS
// =====================================
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId =
      searchParams.get("userId");

    const meetings =
      await prisma.meeting.findMany({
        where: {
          userId: userId || "",
        },

        include: {
          client: true,
          project: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      meetings
    );
  } catch (error) {
    console.error(
      "GET MEETINGS ERROR:",
      error
    );

    return NextResponse.json(
      []
    );
  }
}

// =====================================
// CREATE MEETING
// =====================================

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // BASIC VALIDATION
    if (
      !body.title ||
      !body.userId ||
      !body.date ||
      !body.time
    ) {
      return NextResponse.json(
        {
          error:
            "Title, user, date and time are required",
        },
        {
          status: 400,
        }
      );
    }

    const meeting =
      await prisma.meeting.create({
        data: {
          title: body.title,

          userId: body.userId,

          date: body.date,

          time: body.time,

          duration: body.duration
            ? parseInt(
                String(body.duration),
                10
              )
            : null,

          platform:
            body.platform || "",

          meetingLink:
            body.meetingLink || "",

          notes:
            body.notes || "",

          status:
            body.status || "Scheduled",

          clientId:
            body.clientId,

          projectId:
            body.projectId,
        },

        include: {
          client: true,
          project: true,
        },
      });

    // ================================
    // MEETING CREATED NOTIFICATION
    // ================================

    await prisma.notification
      .create({
        data: {
          userId:
            meeting.userId,

          key:
            `meeting-${meeting.id}-created`,

          type:
            "meeting_created",

          title:
            "Meeting Created",

          message:
            `Meeting "${meeting.title}" has been created successfully.`,

          entityType:
            "meeting",

          entityId:
            meeting.id,

          priority:
            "info",
        },
      })
      .catch((error: any) => {
        // Ignore duplicate notification
        if (error?.code !== "P2002") {
          throw error;
        }
      });

    return NextResponse.json(
      meeting,
      {
        status: 201,
      }
    );

  } catch (error) {
    console.error(
      "CREATE MEETING ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create meeting",
      },
      {
        status: 500,
      }
    );
  }
}

// UPDATE MEETING
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Meeting ID is required" },
        { status: 400 }
      );
    }

    const updatedMeeting =
      await prisma.meeting.update({
        where: {
          id: body.id,
        },

        data: {
          title: body.title,
          date: body.date,
          time: body.time,
          duration: body.duration,

          // Automatically detected platform
          platform: body.platform || "",

          meetingLink:
            body.meetingLink || "",

          notes:
            body.notes || "",

          status:
            body.status || "Scheduled",

          clientId: body.clientId,
          projectId: body.projectId,
        },

        include: {
          client: true,
          project: true,
        },
      });

    return NextResponse.json(
      updatedMeeting
    );

  } catch (error) {
    console.error(
      "UPDATE MEETING ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update meeting",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================
// DELETE MEETING
// =====================================
export async function DELETE(req: Request) {
  try {
    const body =
      await req.json();

    if (!body.id) {
      return NextResponse.json(
        {
          error:
            "Meeting ID is required",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.meeting.delete({
      where: {
        id: body.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE MEETING ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete meeting",
      },
      {
        status: 500,
      }
    );
  }
}