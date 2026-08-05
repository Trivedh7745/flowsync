import {
    PDFDocument,
    StandardFonts,
    rgb,
} from "pdf-lib";
import fs from "fs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function getOrCreateReceiptToken(
    invoiceId: string
) {

    const invoice = await prisma.invoice.findUnique({
        where: {
            id: invoiceId,
        },
        select: {
            id: true,
            publicReceiptToken: true,
        },
    });

    if (!invoice) {
        throw new Error("Invoice not found.");
    }

    // Existing token
    if (invoice.publicReceiptToken) {

        const publicUrl =
            `${process.env.NEXT_PUBLIC_APP_URL}/r/${invoice.publicReceiptToken}`;

        return {
            token: invoice.publicReceiptToken,
            publicUrl,
        };
    }

    // Generate new token
    const token =
        crypto.randomBytes(24).toString("base64url");

    await prisma.invoice.update({
        where: {
            id: invoice.id,
        },
        data: {
            publicReceiptToken: token,
        },
    });

    const publicUrl =
        `${process.env.NEXT_PUBLIC_APP_URL}/r/${token}`;

    return {
        token,
        publicUrl,
    };
}

export async function generateReceiptPdf(invoice: any) {
    const issueDate = invoice.createdAt
    ? new Date(invoice.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
      })
    : "-";


const dueDate = invoice.dueDate
    ? new Date(invoice.dueDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
      })
    : "-";

const receiptNumber =
    invoice.invoiceNumber.replace(
        "INV",
        "REC"
    );

const paidDate =
    invoice.paidDate
        ? new Date(invoice.paidDate)
            .toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            )
        : "-";

const paymentMethod =
    "Online";

const projectName = invoice.project?.title ?? "-";

    const pdfDoc = await PDFDocument.create();

    const page = pdfDoc.addPage([595, 842]);

    const { width, height } = page.getSize();

    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const clientName = invoice.client?.name ?? "-";

const clientCompany = invoice.client?.company ?? "-";

const clientEmail = invoice.client?.email ?? "-";

const description = invoice.project?.title ?? "-";

const installments = invoice.paymentSchedules ?? [];

const quantity = "1";

const rowHeight = 22;

const rate = Number(invoice.amount).toLocaleString("en-IN");

const amount = Number(invoice.amount).toLocaleString("en-IN");

const financialSummary = invoice.financialSummary;

const amountPaid =
    financialSummary.totalPaid;

const projectBudget =
    financialSummary?.projectBudget ?? 0;

const totalPaid =
    financialSummary?.totalPaid ?? 0;

const outstanding =
    financialSummary?.outstandingBalance ?? 0;

const invoiceAmount =
    Number(invoice.amount);

    page.drawRectangle({
    x: 0,
    y: height - 110,
    width,
    height: 110,
    color: rgb(0.42, 0.23, 1),
});

page.drawText("FlowSync", {
    x: 40,
    y: height - 55,
    size: 28,
    font: boldFont,
    color: rgb(1, 1, 1),
});

page.drawText("AI-Powered Work Management", {
    x: 40,
    y: height - 78,
    size: 12,
    font: normalFont,
    color: rgb(0.95, 0.95, 0.95),
});

page.drawText("PAYMENT RECEIPT", {
    x: 40,
    y: height - 150,
    size: 24,
    font: boldFont,
    color: rgb(0.15, 0.15, 0.15),
});
const infoTop = height - 190;

page.drawText("Receipt #", {
    x: 40,
    y: infoTop,
    size: 11,
    font: boldFont,
    color: rgb(0.35, 0.35, 0.35),
});

page.drawText("Issue Date", {
    x: 40,
    y: infoTop - 28,
    size: 11,
    font: boldFont,
    color: rgb(0.35, 0.35, 0.35),
});

page.drawText("Project", {
    x: 40,
    y: infoTop - 56,
    size: 11,
    font: boldFont,
    color: rgb(0.35, 0.35, 0.35),
});

page.drawText(receiptNumber, {
    x: 120,
    y: infoTop,
    size: 11,
    font: normalFont,
});

page.drawText(issueDate, {
    x: 120,
    y: infoTop - 28,
    size: 11,
    font: normalFont,
});

page.drawText(projectName, {
    x: 120,
    y: infoTop - 56,
    size: 11,
    font: normalFont,
});
page.drawText("Invoice #", {
    x: 350,
    y: infoTop,
    size: 11,
    font: boldFont,
    color: rgb(0.35, 0.35, 0.35),
});

page.drawText("Due Date", {
    x: 350,
    y: infoTop - 28,
    size: 11,
    font: boldFont,
    color: rgb(0.35, 0.35, 0.35),
});
page.drawText("Paid Date", {
    x: 350,
    y: infoTop - 56,
    size: 11,
    font: boldFont,
    color: rgb(0.35, 0.35, 0.35),
});
page.drawText(invoice.invoiceNumber ?? "-", {
    x: 430,
    y: infoTop,
    size: 11,
    font: normalFont,
});

page.drawText(dueDate, {
    x: 430,
    y: infoTop - 28,
    size: 11,
    font: normalFont,
});
page.drawText(paidDate, {
    x: 430,
    y: infoTop - 56,
    size: 11,
    font: normalFont,
});
page.drawLine({
    start: { x: 40, y: infoTop - 80 },
    end: { x: width - 40, y: infoTop - 80 },
    thickness: 1,
    color: rgb(0.88, 0.88, 0.88),
});

const companyTop = infoTop - 120;
page.drawText("FROM", {
    x: 40,
    y: companyTop,
    size: 12,
    font: boldFont,
    color: rgb(0.42, 0.23, 1),
});

page.drawText("FlowSync", {
    x: 40,
    y: companyTop - 24,
    size: 13,
    font: boldFont,
});

page.drawText("AI-Powered Work Management", {
    x: 40,
    y: companyTop - 42,
    size: 10,
    font: normalFont,
});

page.drawText("billing@flowsynchub.co.in", {
    x: 40,
    y: companyTop - 58,
    size: 10,
    font: normalFont,
});

page.drawText("flowsynchub.co.in", {
    x: 40,
    y: companyTop - 74,
    size: 10,
    font: normalFont,
});
page.drawText("BILL TO", {
    x: 330,
    y: companyTop,
    size: 12,
    font: boldFont,
    color: rgb(0.42, 0.23, 1),
});

page.drawText(clientName, {
    x: 330,
    y: companyTop - 22,
    size: 13,
    font: boldFont,
});

page.drawText(clientCompany, {
    x: 330,
    y: companyTop - 40,
    size: 10,
    font: normalFont,
});

page.drawText(clientEmail, {
    x: 330,
    y: companyTop - 58,
    size: 10,
    font: normalFont,
});
page.drawLine({
    start: {
        x: 40,
        y: companyTop - 95,
    },
    end: {
        x: width - 40,
        y: companyTop - 95,
    },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9),
});

const tableTop = companyTop - 120;
page.drawRectangle({
    x: 50,
    y: tableTop - 28,
    width: width - 100,
    height: 28,
    color: rgb(0.42,0.23,1),
});
page.drawText("Project", {
    x: 70,
    y: tableTop - 19,
    size: 10,
    font: boldFont,
    color: rgb(1,1,1),
});

page.drawText("Qty", {
    x: 290,
    y: tableTop - 19,
    size: 10,
    font: boldFont,
    color: rgb(1,1,1),
});

page.drawText("Payment Type", {
    x: 350,
    y: tableTop - 19,
    size: 10,
    font: boldFont,
    color: rgb(1,1,1),
});

page.drawText("Total Amount", {
    x: 475,
    y: tableTop - 19,
    size: 10,
    font: boldFont,
    color: rgb(1,1,1),
});
const rowY = tableTop - 50;

page.drawText(projectName,{
    x:70,
    y:rowY,
    size:10,
    font:normalFont,
});

page.drawText("1",{
    x:295,
    y:rowY,
    size:10,
    font:normalFont,
});

page.drawText(paymentMethod,{
    x:350,
    y:rowY,
    size:10,
    font:normalFont,
});

page.drawText(
    `Rs. ${amountPaid.toLocaleString("en-IN")}`,
{
    x:475,
    y:rowY,
    size:10,
    font:boldFont,
    color:rgb(0.13,0.69,0.29),
});
page.drawLine({
    start:{
        x:50,
        y:rowY-18,
    },
    end:{
        x:width-50,
        y:rowY-18,
    },
    thickness:1,
    color:rgb(0.88,0.88,0.88),
});
// ------------------------------
// Notes
// ------------------------------

const notesTop = rowY - 55;

page.drawText("Notes:", {
    x: 50,
    y: notesTop,
    size: 12,
    font: boldFont,
});

page.drawText(
    "This receipt confirms that the payment has been successfully received.",
    {
        x: 50,
        y: notesTop - 20,
        size: 10,
        font: normalFont,
        color: rgb(0.45, 0.45, 0.45),
    }
);

page.drawText(
    "Thank you for your payment.",
    {
        x: 50,
        y: notesTop - 36, // 16px below the first line
        size: 10,
        font: normalFont,
        color: rgb(0.45, 0.45, 0.45),
    }
);
page.drawRectangle({
    x: width - 170,
    y: notesTop - 30,
    width: 110,
    height: 55,
    borderColor: rgb(0.82,0.82,0.82),
    borderWidth: 1,
});
const paidStamp = fs.readFileSync(
    "public/Stamp.png"
);

const paidStampImage =
    await pdfDoc.embedPng(
        paidStamp
    );
page.drawImage(
    paidStampImage,
    {
        x: width - 175,
        y: notesTop - 60,
        width: 110,
        height: 80,
    }
);

const footerY = 45;

// Divider
page.drawLine({
    start: {
        x: 40,
        y: footerY + 55,
    },
    end: {
        x: width - 40,
        y: footerY + 55,
    },
    thickness: 1,
    color: rgb(0.88,0.88,0.88),
});

// Brand

page.drawText("FlowSync", {
    x: 40,
    y: footerY + 28,
    size: 12,
    font: boldFont,
});

page.drawText(
    "AI-Powered Work Management",
    {
        x: 40,
        y: footerY + 12,
        size: 9,
        font: normalFont,
        color: rgb(0.45,0.45,0.45),
    }
);

// Center text

const confirmText =
    "This receipt confirms that payment has been received.";

const confirmWidth =
    normalFont.widthOfTextAtSize(
        confirmText,
        9
    );

page.drawText(confirmText, {
    x: (width - confirmWidth) / 2,
    y: footerY + 18,
    size: 9,
    font: normalFont,
    color: rgb(0.45, 0.45, 0.45),
});


// Website

page.drawText(
    "www.flowsynchub.co.in",
    {
        x: width - 155,
        y: footerY + 12,
        size: 9,
        font: normalFont,
    }
);
const pdfBytes = await pdfDoc.save();

return Buffer.from(pdfBytes);

}