import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET CLIENTS
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
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

    const client = await prisma.client.create({
      data: {
        name: body.name,
        email: body.email,
        company: body.company,
      },
    });

    return NextResponse.json(client);
  }catch (error) {
    console.error("CLIENT POST ERROR:", error);

    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}