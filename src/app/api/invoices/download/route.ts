import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateInvoicePdf } from "@/lib/pdf/invoice";
import { buildFinancialSummary } from "@/lib/invoice";

export async function GET(request: NextRequest) {
    try{
    const { searchParams } =
    new URL(request.url);

const invoiceId =
    searchParams.get("id");

if (!invoiceId) {

    return NextResponse.json(
        {
            error: "Invoice ID is required.",
        },
        {
            status: 400,
        }
    );

}
const invoice =
    await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
        },

        include: {
            client: true,
            project: true,
            paymentSchedules: true,
        },
    });
if (!invoice) {

    return NextResponse.json(
        {
            error: "Invoice not found.",
        },
        {
            status: 404,
        }
    );

}
const financialSummary =
    buildFinancialSummary(invoice);

const enrichedInvoice = {
    ...invoice,
    financialSummary,
};

const pdf =
    await generateInvoicePdf(
        enrichedInvoice
    );
return new NextResponse(pdf, {
    headers: {
        "Content-Type":
            "application/pdf",

        "Content-Disposition":
            `attachment; filename="${invoice.invoiceNumber}.pdf"`,
    },
});
}
catch (error) {

        console.error("Invoice PDF Error:", error);

        return NextResponse.json(
            {
                error: "Failed to generate Invoice.",
            },
            {
                status: 500,
            }
        );

    }
}