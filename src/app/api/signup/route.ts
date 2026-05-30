import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, company } =
      await request.json();

    const workspace =
      await prisma.workspace.create({
        data: {
          name,
          email,
          company,
        },
      });

    return NextResponse.json({
      success: true,
      workspace,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const workspaces =
      await prisma.workspace.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(workspaces);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Database error" },
      { status: 500 }
    );
  }
}