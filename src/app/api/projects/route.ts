import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET PROJECTS
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      include: {
        client: true,
        invoices: true,
        tasks: {
          include: {
            subtasks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("PROJECT GET ERROR:");
    console.error("Message:", error?.message);
    console.error("Code:", error?.code);
    console.error("Meta:", error?.meta);
    console.error(error);

    return NextResponse.json(
      {
        error: error?.message || "Failed to fetch projects",
        code: error?.code || null,
      },
      { status: 500 }
    );
  }
}

// CREATE PROJECT
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const project = await prisma.project.create({
  data: {
    title: body.title,
    userId: body.userId,
    description: body.description,
    clientId: body.clientId,
    deadline: body.deadline,
    budget: body.budget,
    revenue: body.revenue,
  },
});

await prisma.notification.create({
  data: {
    userId: project.userId,
    key: `project-${project.id}-created`,
    type: "project_created",
    title: "Project Created",
    message: `Project "${project.title}" has been created successfully.`,
    entityType: "project",
    entityId: project.id,
    priority: "info",
  },
});

return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// DELETE PROJECT
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Project id required" },
        { status: 400 }
      );
    }

    // Check related records
    const [
      taskCount,
      invoiceCount,
      documentCount,
      meetingCount,
    ] = await Promise.all([
      prisma.task.count({
        where: {
          projectId: id,
        },
      }),

      prisma.invoice.count({
        where: {
          projectId: id,
        },
      }),

      prisma.document.count({
        where: {
          projectId: id,
        },
      }),

      prisma.meeting.count({
        where: {
          projectId: id,
        },
      }),
    ]);

    // If related records exist, don't delete project
    if (
      taskCount > 0 ||
      invoiceCount > 0 ||
      documentCount > 0 ||
      meetingCount > 0
    ) {
      return NextResponse.json(
        {
          error:
            "Please delete related records before deleting this project.",

          related: {
            tasks: taskCount,
            invoices: invoiceCount,
            documents: documentCount,
            meetings: meetingCount,
          },
        },
        {
          status: 409,
        }
      );
    }

    // No related records → delete project
    await prisma.project.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });

  } catch (error: any) {
    console.error(
      "PROJECT DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to delete project",
      },
      {
        status: 500,
      }
    );
  }
}

// UPDATE PROJECT
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        {
          error: "Project id is required",
        },
        {
          status: 400,
        }
      );
    }

    const existingProject =
      await prisma.project.findUnique({
        where: {
          id: body.id,
        },
      });

    if (!existingProject) {
      return NextResponse.json(
        {
          error: "Project not found",
        },
        {
          status: 404,
        }
      );
    }

    const updatedProject =
      await prisma.project.update({
        where: {
          id: body.id,
        },

        data: {
          title: body.title,
          description: body.description,
          deadline: body.deadline,
          clientId: body.clientId,
          budget: body.budget,
          // Update status when provided
          status:
            body.status ??
            existingProject.status,
        },
      });

    // Project completed notification
    // Only create it when the project changes
    // from a non-completed state to Completed.
    if (
      String(updatedProject.status)
        .toLowerCase() === "completed" &&
      String(existingProject.status)
        .toLowerCase() !== "completed"
    ) {
      await prisma.notification
        .create({
          data: {
            userId:
              updatedProject.userId,

            key:
              `project-${updatedProject.id}-completed`,

            type:
              "project_completed",

            title:
              "Project Completed",

            message:
              `"${updatedProject.title}" has been successfully completed. Before sharing the final project with the client, make sure the outstanding payment has been received.`,

            entityType:
              "project",

            entityId:
              updatedProject.id,

            priority:
              "success",
          },
        })
        .catch((error: any) => {
          // Ignore duplicate notification
          if (error?.code !== "P2002") {
            throw error;
          }
        });
    }

    return NextResponse.json(
      updatedProject
    );

  } catch (error) {
    console.error(
      "PROJECT UPDATE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update project",
      },
      {
        status: 500,
      }
    );
  }
}