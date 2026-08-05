import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const body = await req.json();

    console.log("ID:", id);
    console.log("BODY:", body);

    const client = await prisma.client.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        email: body.email,
        company: body.company,
      },
    });

    return NextResponse.json(client);

  } catch (error) {

    console.error("PUT ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update client",
      },
      { status: 500 }
    );

  }
}