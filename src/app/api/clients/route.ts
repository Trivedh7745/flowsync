import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET CLIENTS
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const clients = await prisma.client.findMany({
      where: {
        userId: userId || "",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
     console.error("CLIENT GET ERROR:", error);

     return NextResponse.json(
      { error: String(error) },
      { status: 500 }
     );
    }
}

// CREATE CLIENT
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("CLIENT BODY:", body);
    console.log("USER ID:", body.userId);

    const client = await prisma.client.create({
      data: {
        userId: body.userId,
        name: body.name,
        email: body.email,
        company: body.company,
      },
    });

    return NextResponse.json(client);
  }catch (error) {
  console.error("CLIENT CREATE ERROR:", error);

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