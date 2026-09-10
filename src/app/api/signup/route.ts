import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, company, userId } =
      await request.json();

    if (!name?.trim() || !email?.trim() || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email and userId are required",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check whether a FlowSync workspace already exists
    // for this email.
    const existingWorkspace =
      await prisma.workspace.findFirst({
        where: {
          email: normalizedEmail,
        },
      });

    if (existingWorkspace) {
      return NextResponse.json({
        success: true,
        existing: true,
        message:
          "An account with this email already exists. Please login.",
        workspace: existingWorkspace,
      });
    }

    // Create a new workspace
    const workspace =
      await prisma.workspace.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          company: company?.trim() || null,
          userId,
        },
      });

    return NextResponse.json({
      success: true,
      existing: false,
      message: "Workspace created successfully",
      workspace,
    });
  } catch (error) {
    console.error("SIGNUP API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    // Used by Google signup to check whether
    // the email already belongs to a FlowSync workspace.
    if (email) {
      const normalizedEmail =
        email.trim().toLowerCase();

      const workspace =
        await prisma.workspace.findFirst({
          where: {
            email: normalizedEmail,
          },
        });

      return NextResponse.json({
        exists: !!workspace,
        workspace: workspace || null,
      });
    }

    // Existing behavior: return all workspaces
    const workspaces =
      await prisma.workspace.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(workspaces);
  } catch (error) {
    console.error("SIGNUP GET ERROR:", error);

    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}