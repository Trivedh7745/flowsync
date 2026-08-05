import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {

    const body = await req.json();

    const {
      paymentId,
      paid,
    } = body;

    const payment =
      await prisma.paymentSchedule.update({

        where: {
          id: paymentId,
        },

        data: {
          paidDate: paid
            ? new Date()
            : null,
        },

      });

    const currentPayment =
    await prisma.paymentSchedule.findUnique({

        where: {
    id: paymentId,
},

        include: {

            invoice: {

                include: {

                    project: true,

                },

            },

        },

    });

if (!currentPayment) {

    return NextResponse.json(
        {
            error: "Payment not found.",
        },
        {
            status: 404,
        }
    );

}

const allPayments =
    await prisma.paymentSchedule.findMany({

        where: {
            invoiceId:
                currentPayment.invoiceId,
        },

    });


const totalPaid =
    allPayments.reduce(

        (sum, payment) =>

            payment.paidDate
                ? sum + Number(payment.amount)
                : sum,

        0

    );

const projectBudget =
    Number(currentPayment.invoice.project.budget);

// =====================================
// INVOICE STATUS
// =====================================

const outstanding =
    Math.max(
        projectBudget - totalPaid,
        0
    );

let invoiceStatus = "Sent";

if (totalPaid === 0) {

    invoiceStatus = "Sent";

}
else if (outstanding > 0) {

    invoiceStatus = "Partially Paid";

}
else {

    invoiceStatus = "Paid";

}

const invoicePaidDate =
    invoiceStatus === "Paid"
        ? new Date()
        : null;

// =====================================
// UPDATE INVOICE
// =====================================

await prisma.invoice.update({

    where: {

        id: currentPayment.invoiceId,

    },

    data: {

        status: invoiceStatus,

        paidDate: invoicePaidDate,

    },

});

const updatedInvoice =
    await prisma.invoice.findUnique({

        where: {

            id: currentPayment.invoiceId,

        },

        include: {

            paymentSchedules: true,

            client: true,

            project: true,

        },

    });

return NextResponse.json(updatedInvoice);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to update payment.",
      },
      {
        status: 500,
      }
    );

  }
}

export async function PUT(req: NextRequest) {

    try {

        const body = await req.json();

        const {

            paymentId,

            dueDate,

            amount,

        } = body;


    const currentPayment =
    await prisma.paymentSchedule.findUnique({

        where: {

            id: paymentId,

        },

        include: {

            invoice: {

                include: {

                    project: true,

                    paymentSchedules: true,

                },

            },

        },

    });

if (!currentPayment) {

    return NextResponse.json(

        {

            error: "Payment not found.",

        },

        {

            status: 404,

        }

    );

}
const otherPayments =
    currentPayment.invoice.paymentSchedules.filter(

        payment => payment.id !== paymentId

    );

const alreadyScheduled =
    otherPayments.reduce(

        (sum, payment) =>

            sum + Number(payment.amount),

        0

    );

const projectBudget =
    Number(currentPayment.invoice.project.budget);

if (

    alreadyScheduled + Number(amount)

    >

    projectBudget

) {

    return NextResponse.json(

        {

            error:

                "Installment exceeds remaining budget.",

        },

        {

            status: 400,

        }

    );

}
await prisma.paymentSchedule.update({

    where: {

        id: paymentId,

    },

    data: {

        dueDate:

            new Date(dueDate),

        amount:

            Number(amount),

    },

});
const allPayments =
    await prisma.paymentSchedule.findMany({

        where: {

            invoiceId:
                currentPayment.invoiceId,

        },

    });
const totalPaid =
    allPayments.reduce(

        (sum, payment) =>

            payment.paidDate

                ? sum + Number(payment.amount)

                : sum,

        0

    );
const outstanding =
    Math.max(

        projectBudget - totalPaid,

        0

    );

let invoiceStatus = "Sent";

if (totalPaid === 0) {

    invoiceStatus = "Sent";

}
else if (outstanding > 0) {

    invoiceStatus = "Partially Paid";

}
else {

    invoiceStatus = "Paid";

}
const invoicePaidDate =
    invoiceStatus === "Paid"

        ? new Date()

        : null;
await prisma.invoice.update({

    where: {

        id: currentPayment.invoiceId,

    },

    data: {

        status: invoiceStatus,

        paidDate: invoicePaidDate,

    },

});
const updatedInvoice =
    await prisma.invoice.findUnique({

        where: {

            id: currentPayment.invoiceId,

        },

        include: {

            paymentSchedules: true,

            client: true,

            project: true,

        },

    });

return NextResponse.json(updatedInvoice);
    } catch (error) {

        console.error(error);

        return NextResponse.json(

            {
                error: "Unable to update payment.",
            },

            {
                status: 500,
            }

        );

    }

}

export async function DELETE(
    req: NextRequest
) {

    try {

        const body = await req.json();

        const { paymentId } = body;
    
        const payment =
    await prisma.paymentSchedule.findUnique({

        where: {

            id: paymentId,

        },

        include: {

            invoice: {

                include: {

                    project: true,

                },

            },

        },

    });

if (!payment) {

    return NextResponse.json(

        {

            error: "Payment not found.",

        },

        {

            status: 404,

        }

    );

}

await prisma.paymentSchedule.delete({

    where: {

        id: paymentId,

    },

});

const allPayments =
    await prisma.paymentSchedule.findMany({

        where: {

            invoiceId:
                payment.invoiceId,

        },

    });

const totalPaid =
    allPayments.reduce(

        (sum, payment) =>

            payment.paidDate

                ? sum + Number(payment.amount)

                : sum,

        0

    );
const projectBudget =
    Number(payment.invoice.project.budget);
const outstanding =
    Math.max(
        projectBudget - totalPaid,
        0
    );

let invoiceStatus = "Sent";

if (totalPaid === 0) {

    invoiceStatus = "Sent";

}
else if (outstanding > 0) {

    invoiceStatus = "Partially Paid";

}
else {

    invoiceStatus = "Paid";

}

const invoicePaidDate =
    invoiceStatus === "Paid"
        ? new Date()
        : null;

await prisma.invoice.update({

    where: {

        id: payment.invoiceId,

    },

    data: {

        status: invoiceStatus,

        paidDate: invoicePaidDate,

    },

});

const updatedInvoice =
    await prisma.invoice.findUnique({

        where: {

            id: payment.invoiceId,

        },

        include: {

            paymentSchedules: true,

            client: true,

            project: true,

        },

    });

return NextResponse.json(updatedInvoice);

} catch (error) {

    console.error(error);

    return NextResponse.json(

        {

            error: "Unable to delete payment.",

        },

        {

            status: 500,

        }

    );

}
}

export async function POST(req: NextRequest) {

    try {

        const body = await req.json();

        const payment =
            await prisma.paymentSchedule.create({

                data: {

                    invoiceId: body.invoiceId,

                    dueDate: new Date(body.dueDate),

                    amount: Number(body.amount),

                    paidDate: null,

                },

            });

        return NextResponse.json(payment);

    } catch (error) {

        console.error(error);

        return NextResponse.json(

            {
                error: "Unable to create payment.",
            },

            {
                status: 500,
            }

        );

    }

}
