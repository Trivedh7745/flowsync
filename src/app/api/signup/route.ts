import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      const workspaces = await prisma.workspace.findMany();

      return Response.json({
        success: true,
        workspaces,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check FlowSync workspace first.
    const workspace = await prisma.workspace.findFirst({
      where: {
        email: normalizedEmail,
      },
    });

    // Check Supabase Auth users server-side.
    let authUserExists = false;

    let page = 1;
    const perPage = 1000;

    while (!authUserExists) {
      const {
        data: { users },
        error,
      } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage,
      });

      if (error) {
        console.error(
          "Supabase Auth user lookup error:",
          error
        );

        return Response.json(
          {
            error: "Unable to verify this email address",
          },
          { status: 500 }
        );
      }

      const matchingUser = users.find(
        (user) =>
          user.email?.trim().toLowerCase() ===
          normalizedEmail
      );

      if (matchingUser) {
        authUserExists = true;
        break;
      }

      if (users.length < perPage) {
        break;
      }

      page += 1;
    }

    const exists =
      Boolean(workspace) || authUserExists;

    return Response.json({
      exists,
      workspaceExists: Boolean(workspace),
      authUserExists,
      workspace: workspace || null,
    });
  } catch (error) {
    console.error(
      "GET /api/signup error:",
      error
    );

    return Response.json(
      {
        error: "Unable to check this email address",
      },
      { status: 500 }
    );
  }
}