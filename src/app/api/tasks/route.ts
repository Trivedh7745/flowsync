import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET TASKS
export async function GET() {
  try {
    const tasks = await prisma.task.findMany();

    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// CREATE TASK
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const task = await prisma.task.create({
      data: {
        title: body.title,
        status: body.status,
        priority: body.priority,
        projectId: body.projectId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

// UPDATE TASK
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updatedTask = await prisma.task.update({
      where: {
        id: body.id,
      },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE TASK
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    await prisma.task.delete({
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
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}