import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET TASKS
export async function GET(req: Request) {
  try {
     const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const tasks = await prisma.task.findMany({
    where: {
        userId: userId || ""
      },
    include: {
      project: true,
      subtasks: true,
    },
    orderBy: {
    createdAt: "desc",
    },  
    });  
    return NextResponse.json(tasks);
  } catch (error:any) {
    
      console.error("FULL ERROR:", error);
    
      return NextResponse.json(
        {
          error: String(error)
        },
        {
          status: 500
        }
      );
    
    }
}

// CREATE TASK
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const task = await prisma.task.create({
  data: {
    userId: body.userId,
    title: body.title,
    status: body.status,
    priority: body.priority,
    projectId: body.projectId,
    dueDate: body.dueDate,
  },
});

// CREATE TASK CREATED NOTIFICATION
await prisma.notification
  .create({
    data: {
      userId: task.userId,

      key: `task-${task.id}-created`,

      type: "task_created",

      title: "Task Created",

      message: `Task "${task.title}" has been added successfully.`,

      entityType: "task",

      entityId: task.id,

      priority: "info",
    },
  })
  .catch((error: any) => {
    // Ignore duplicate notification
    if (error?.code !== "P2002") {
      throw error;
    }
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

    const updatedTask =
      await prisma.task.update({

        where: {
          id: body.id,
        },

        data: {

          title: body.title,

          status: body.status,

          priority: body.priority,

          projectId: body.projectId,

          dueDate: body.dueDate,

        },

      });

    return NextResponse.json(updatedTask);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to update task",
      },
      {
        status: 500,
      }
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