import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    console.log("PARAM CLIENT ID:", clientId);
    const projects = await prisma.project.findMany({

      where: {
        clientId: clientId,
      },

      orderBy: {
        createdAt: "desc",
      },

    });
    console.log("CLIENT ID:", clientId);
console.log("PROJECTS:", projects);
    console.log("FILTERED PROJECTS:", projects);

    return NextResponse.json(projects);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );

  }
}