import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET INVOICES
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        client: true,
        project: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

// CREATE INVOICE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const invoice = await prisma.invoice.create({
      data: {
        amount: body.amount,
        status: body.status,
        dueDate: body.dueDate,
        clientId: body.clientId,
        projectId: body.projectId,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}

// UPDATE INVOICE STATUS
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const updatedInvoice =
      await prisma.invoice.update({
        where: {
          id: body.id,
        },
        data: {
          status: body.status,
        },
      });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update invoice" },
      { status: 500 }
    );
  }
}

// DELETE INVOICE
export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    await prisma.invoice.delete({
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
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}