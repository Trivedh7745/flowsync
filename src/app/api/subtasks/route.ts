import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET SUBTASKS
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const taskId = searchParams.get("taskId");

    const subtasks = await prisma.subtask.findMany({
      where: {
        taskId: taskId || "",
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(subtasks);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch subtasks" },
      { status: 500 }
    );
  }
}

// Create Subtasks
export async function POST(req: Request) {
  try {

    const body = await req.json();

    const subtask = await prisma.$transaction(async (tx) => {

      const newSubtask = await tx.subtask.create({
        data: {
          title: body.title,
          taskId: body.taskId,
        },
      });

      await tx.activity.create({
        data: {
          taskId: body.taskId,
          type: "SUBTASK_CREATED",
          title: "Subtask Added",
          description: `"${body.title}" was added`,
          icon: "➕",
        },
      });

      return newSubtask;

    });

    return NextResponse.json(subtask);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create subtask",
      },
      {
        status: 500,
      }
    );

  }
}

// UPDATE SUBTASK
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // 1. Update subtask
    const updatedSubtask =
      await prisma.subtask.update({
        where: {
          id: body.id,
        },
        data: {
          title: body.title ?? undefined,
          completed:
            body.completed ?? undefined,
        },
      });

    // 2. Create activity
    await prisma.activity.create({
      data: {
        taskId: updatedSubtask.taskId,

        type: body.completed
          ? "SUBTASK_COMPLETED"
          : "SUBTASK_UNCHECKED",

        title: body.completed
          ? "Subtask Completed"
          : "Subtask Updated",

        description:
          updatedSubtask.title,

        icon: body.completed
          ? "✅"
          : "🔄",
      },
    });

    // 3. Get all subtasks of this task
    const subtasks =
      await prisma.subtask.findMany({
        where: {
          taskId:
            updatedSubtask.taskId,
        },
      });

    const totalSubtasks =
      subtasks.length;

    const completedSubtasks =
      subtasks.filter(
        (subtask) =>
          subtask.completed
      ).length;

    // 4. Calculate progress
    const progress =
      totalSubtasks === 0
        ? 0
        : Math.round(
            (completedSubtasks /
              totalSubtasks) *
              100
          );

    // 5. Calculate status
    let status = "Not Started";

    if (progress === 100) {
      status = "Completed";
    } else if (progress > 0) {
      status = "In Progress";
    }

    // 6. Update parent task
    const updatedTask =
      await prisma.task.update({
        where: {
          id: updatedSubtask.taskId,
        },
        data: {
          progress,
          status,
        },
        include: {
          project: true,
        },
      });

    // 7. Create Task Completed notification
    // only when the task has just become completed
    if (
      status === "Completed" &&
      body.completed === true
    ) {
      await prisma.notification.create({
        data: {
          userId:
            updatedTask.userId,

          key:
            `task-${updatedTask.id}-completed`,

          type:
            "task_completed",

          title:
            "Task Completed",

          message:
            `You have completed "${updatedTask.title}" successfully. Complete the remaining tasks to finish the project within the deadline.`,

          entityType:
            "task",

          entityId:
            updatedTask.id,

          priority:
            "success",
        },
      }).catch((error: any) => {
        // Ignore duplicate notification
        if (error?.code !== "P2002") {
          throw error;
        }
      });
    }

    return NextResponse.json(
      updatedSubtask
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to update subtask",
      },
      {
        status: 500,
      }
    );
  }
}

// DELETE SUBTASK
export async function DELETE(req: Request) {
  try {

    const body = await req.json();

    const subtask =
      await prisma.subtask.findUnique({
        where: {
          id: body.id,
        },
      });

    if (!subtask) {
      return NextResponse.json(
        { error: "Subtask not found" },
        { status: 404 }
      );
    }

    await prisma.activity.create({
      data: {
        taskId: subtask.taskId,
        type: "SUBTASK_DELETED",
        title: "Subtask Deleted",
        description: subtask.title,
        icon: "🗑️",
      },
    });

    await prisma.subtask.delete({
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
      {
        error: "Failed to delete subtask",
      },
      {
        status: 500,
      }
    );

  }
}