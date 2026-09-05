import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildFinancialSummary } from "@/lib/invoice";


// GET INVOICES
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

  // Automatically mark overdue invoices
await prisma.invoice.updateMany({

    where: {

        userId: userId || "",

        status: {

            in: [
                "Sent",
                "Pending",
                "Partially Paid",
            ],

        },

        dueDate: {

            lt: new Date(),

        },

    },

    data: {

        status: "Overdue",

    },

});
    const invoices = await prisma.invoice.findMany({
      where: {
        userId: userId || "",
      },
      include: {
        client: true,
        project: true,
        paymentSchedules: {

        orderBy: {

            dueDate: "asc"

        }

    }
      },
      orderBy: {
        createdAt: "desc",
      },
     
    });
     const enrichedInvoices = invoices.map((invoice) => {
    return {

    ...invoice,

    financialSummary:
        buildFinancialSummary(invoice),

};
});
    return NextResponse.json(
    enrichedInvoices
);
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

// CREATE INVOICE
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const project =
    await prisma.project.findUnique({

        where: {

            id: body.projectId,

        },

    });

if (!project) {

    return NextResponse.json(

        {

            error: "Project not found.",

        },

        {

            status: 404,

        }

    );

}
const projectBudget =
    Number(project.budget);

const invoiceAmount =
    Number(body.amount);

if (

    body.paymentSchedule &&

    invoiceAmount >= projectBudget

) {

    return NextResponse.json(

        {

            error:
                "Payment Schedule is available only for partial invoices (invoice amount less than the project budget).",

        },

        {

            status: 400,

        }

    );

}
    const lastInvoice = await prisma.invoice.findFirst({
  orderBy: {
    createdAt: "desc",
  },
});

let nextNumber = 1;

if (lastInvoice?.invoiceNumber) {
  nextNumber =
    parseInt(
      lastInvoice.invoiceNumber.replace("INV-", "")
    ) + 1;
}

const invoiceNumber =
  `INV-${String(nextNumber).padStart(3, "0")}`;
    const invoice = await prisma.invoice.create({
    data: {

  invoiceNumber,

  amount: Number(body.amount),

  status: "Draft",

  issueDate: new Date(body.issueDate),

  paidDate: null,

  dueDate: new Date(body.dueDate),

  clientId: body.clientId,

  projectId: body.projectId,

  userId: body.userId,

  paymentSchedule: body.paymentSchedule ?? false,

}
   });
    // CREATE INVOICE NOTIFICATION
await prisma.notification
  .create({
    data: {
      userId: invoice.userId,

      key: `invoice-${invoice.id}-created`,

      type: "invoice_created",

      title: "Invoice Created",

      message: `Invoice "${invoice.invoiceNumber}" has been created successfully.`,

      entityType: "invoice",

      entityId: invoice.id,

      priority: "info",
    },
  })
  .catch((error: any) => {
    // Ignore duplicate notification
    if (error?.code !== "P2002") {
      throw error;
    }
  });
    if (body.paymentSchedule) {

    await prisma.paymentSchedule.create({

        data: {

            invoiceId: invoice.id,

            amount: Number(body.amount),

            dueDate: new Date(body.dueDate),

            paidDate: null,

        }

    });

}
    await prisma.project.update({

  where: {
    id: body.projectId
  },

  data: {
    revenue: {
      increment: Number(body.amount)
    }
  }
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

// UPDATE INVOICE
export async function PUT(req: Request) {
  try {

    const body = await req.json();
    const project =
    await prisma.project.findUnique({

        where: {

            id: body.projectId,

        },

    });

if (!project) {

    return NextResponse.json(

        {

            error: "Project not found.",

        },

        {

            status: 404,

        }

    );

}
const projectBudget =
    Number(project.budget);

const invoiceAmount =
    Number(body.amount);

if (

    body.paymentSchedule &&

    invoiceAmount >= projectBudget

) {

    return NextResponse.json(

        {

            error:
                "Payment Schedule is available only for partial invoices (invoice amount less than the project budget).",

        },

        {

            status: 400,

        }

    );

}

    const existingInvoice = await prisma.invoice.findUnique({
      where: {
        id: body.id,
      },
    });

    const updatedInvoice = await prisma.invoice.update({

      where: {
        id: body.id,
      },
      data: {
  amount: Number(body.amount),

  issueDate: new Date(body.issueDate),

  dueDate: new Date(body.dueDate),

  paymentSchedule: body.paymentSchedule,

  status: body.status,

  paidDate:
  body.status === "Paid"
    ? existingInvoice?.paidDate ?? new Date()
    : null,    
},

      include: {
        client: true,
        project: true,
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

      where:{
        id:body.id
      }

    });

    return NextResponse.json({

      success:true

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(

      {
        error:"Failed to delete invoice"
      },

      {
        status:500
      }

    );

  }

}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      invoiceId,
      paid,
    } = body;

    const existingInvoice =
      await prisma.invoice.findUnique({
        where: {
          id: invoiceId,
        },
        include: {
          project: true,
        },
      });

    if (!existingInvoice) {
      return NextResponse.json(
        {
          error: "Invoice not found.",
        },
        {
          status: 404,
        }
      );
    }

    const updatedInvoice =
      await prisma.invoice.update({
        where: {
          id: invoiceId,
        },
        data: {
          paidDate: paid
            ? new Date()
            : null,

          status: paid
            ? "Paid"
            : "Sent",
        },
        include: {
          client: true,
          project: true,
          paymentSchedules: true,
        },
      });

    // Create payment notification
    if (paid) {
      const invoiceNumber =
        updatedInvoice.invoiceNumber ||
        updatedInvoice.id;

      await prisma.notification.create({
        data: {
          userId: updatedInvoice.userId,

          key: `invoice-${updatedInvoice.id}-paid`,

          type: "invoice_paid",

          title: "Payment Received",

          message: `The payment for invoice "${invoiceNumber}" has been successfully received.`,

          entityType: "invoice",

          entityId: updatedInvoice.id,

          priority: "success",
        },
      });

      // Project payment notification
      if (updatedInvoice.project) {
        await prisma.notification.create({
          data: {
            userId: updatedInvoice.userId,

            key: `project-${updatedInvoice.project.id}-payment-received`,

            type: "project_payment_received",

            title: "Project Payment Received",

            message: `Payment for "${updatedInvoice.project.title}" has been successfully received. The completed project is now ready to be shared with the client.`,

            entityType: "project",

            entityId: updatedInvoice.project.id,

            priority: "success",
          },
        });
      }
    }

    return NextResponse.json(
      updatedInvoice
    );

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to update invoice.",
      },
      {
        status: 500,
      }
    );
  }
}

