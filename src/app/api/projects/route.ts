import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET PROJECTS
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const projects = await prisma.project.findMany({
      where: {
        userId: userId || "",
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
        revenue: body.revenue
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

    await prisma.project.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("PROJECT DELETE ERROR:", error);

    return NextResponse.json(
      {
        error: String(error),
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
        },
      });

    return NextResponse.json(updatedProject);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to update project",
      },
      {
        status: 500,
      }
    );
  }
}