import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const runtime = "nodejs";

// GET MEETINGS
export async function GET() {
  try {
    const meetings =
      await prisma.meeting.findMany({
        include: {
          client: true,
          project: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(meetings);
  } catch (error) {
    console.error(error);

    return NextResponse.json([]);
  }
}

// CREATE MEETING
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const meeting =
      await prisma.meeting.create({
        data: {
          title: body.title,
          date: body.date,
          time: body.time,
          meetingLink:
            body.meetingLink || "",
          notes: body.notes || "",
          status:
            body.status || "Scheduled",
          clientId: body.clientId,
          projectId: body.projectId,
        },
      });

    return NextResponse.json(meeting);
  } catch (error) {
    console.error(
      "CREATE MEETING ERROR:",
      error
    );

    return NextResponse.json(
      { error: "Failed to create meeting" },
      { status: 500 }
    );
  }
}

// UPDATE MEETING STATUS
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updatedMeeting =
      await prisma.meeting.update({
        where: {
          id: body.id,
        },
        data: {
          status: body.status,
        },
      });

    return NextResponse.json(
      updatedMeeting
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update meeting" },
      { status: 500 }
    );
  }
}

// DELETE MEETING
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    await prisma.meeting.delete({
      where: {
        id: body.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete meeting" },
      { status: 500 }
    );
  }
}