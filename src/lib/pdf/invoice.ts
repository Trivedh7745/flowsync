import {
    PDFDocument,
    StandardFonts,
    rgb,
} from "pdf-lib";

export async function generateInvoicePdf(invoice: any) {
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

page.drawText("INVOICE", {
    x: 40,
    y: height - 150,
    size: 24,
    font: boldFont,
    color: rgb(0.15, 0.15, 0.15),
});
const infoTop = height - 190;

page.drawText("Invoice #", {
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
page.drawText(invoice.invoiceNumber ?? "-", {
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
page.drawText("Status", {
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
page.drawText(invoice.status ?? "-", {
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
    y: companyTop - 24,
    size: 13,
    font: boldFont,
});

page.drawText(clientCompany, {
    x: 330,
    y: companyTop - 42,
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
const tableTop = companyTop - 130;

const isInstallmentInvoice =
    invoice.paymentSchedule &&
    installments.length > 0;
const cardX = 330;

const cardWidth = 225;

const cardHeight = 120;

let rowY = tableTop - 20;
let tableBottomY = tableTop - 35; 
if (isInstallmentInvoice) 
    {
page.drawRectangle({
    x: 40,
    y: tableTop,
    width: width - 80,
    height: 28,
    color: rgb(0.95, 0.95, 0.98),
});

page.drawText("Installment", {
    x: 50,
    y: tableTop + 8,
    size: 10,
    font: boldFont,
});

page.drawText("Due Date", {
    x: 210,
    y: tableTop + 8,
    size: 10,
    font: boldFont,
});

page.drawText("Amount", {
    x: 340,
    y: tableTop + 8,
    size: 10,
    font: boldFont,
});

page.drawText("Status", {
    x: 470,
    y: tableTop + 8,
    size: 10,
    font: boldFont,
});

installments.forEach(
    (payment: any, index: number) => {

        const dueDate = payment.dueDate
            ? new Date(payment.dueDate).toLocaleDateString(
                  "en-IN",
                  {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                  }
              )
            : "-";

        const amount = Number(payment.amount)
            .toLocaleString("en-IN");

        const paid = !!payment.paidDate;

        page.drawText(
            `Installment ${index + 1}`,
            {
                x: 50,
                y: rowY,
                size: 10,
                font: normalFont,
            }
        );

        page.drawText(
            dueDate,
            {
                x: 210,
                y: rowY,
                size: 10,
                font: normalFont,
            }
        );

        page.drawText(
            `Rs. ${amount}`,
            {
                x: 340,
                y: rowY,
                size: 10,
                font: normalFont,
            }
        );

        page.drawText(
            paid ? "Paid" : "Pending",
            {
                x: 470,
                y: rowY,
                size: 10,
                font: boldFont,
                color: paid
                    ? rgb(0.13, 0.69, 0.29)
                    : rgb(0.23, 0.52, 0.96),
            }
        );

        rowY -= rowHeight;
    }
);
tableBottomY = rowY + 8;
page.drawLine({
    start: {
        x: 40,
        y: rowY + 8,
    },
    end: {
        x: width - 40,
        y: rowY + 8,
    },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
});
}
else{

page.drawRectangle({
    x: 40,
    y: tableTop,
    width: width - 80,
    height: 28,
    color: rgb(0.95, 0.95, 0.98),
});
page.drawText("Description", {
    x: 50,
    y: tableTop + 8,
    size: 10,
    font: boldFont,
});

page.drawText("Qty", {
    x: 300,
    y: tableTop + 8,
    size: 10,
    font: boldFont,
});

page.drawText("Rate", {
    x: 360,
    y: tableTop + 8,
    size: 10,
    font: boldFont,
});

page.drawText("Amount", {
    x: 470,
    y: tableTop + 8,
    size: 10,
    font: boldFont,
});
page.drawText(description, {
    x: 50,
    y: tableTop - 20,
    size: 10,
    font: normalFont,
});

page.drawText(quantity, {
    x: 305,
    y: tableTop - 20,
    size: 10,
    font: normalFont,
});

page.drawText(`Rs. ${rate}`, {
    x: 360,
    y: tableTop - 20,
    size: 10,
    font: normalFont,
});

page.drawText(`Rs. ${amount}`, {
    x: 470,
    y: tableTop - 20,
    size: 10,
    font: normalFont,
});
page.drawLine({
    start: {
        x: 40,
        y: tableTop - 35,
    },
    end: {
        x: width - 40,
        y: tableTop - 35,
    },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.85),
});
tableBottomY = tableTop - 35;
}
const notesTop = isInstallmentInvoice
    ? rowY - 25
    :  tableBottomY - 35;
const cardY = isInstallmentInvoice
    ? notesTop - 10
    : notesTop + 10;

page.drawText("Notes", {
    x: 40,
    y: notesTop,
    size: 12,
    font: boldFont,
    color: rgb(0.15, 0.15, 0.15),
});
page.drawText(
    "Thank you for choosing FlowSync.",
    {
        x: 40,
        y: notesTop - 20,
        size: 10,
        font: normalFont,
        color: rgb(0.45, 0.45, 0.45),
    }
);

page.drawRectangle({
    x: cardX,
    y: cardY - cardHeight,
    width: cardWidth,
    height: cardHeight,
    color: rgb(0.98, 0.98, 1),
    borderColor: rgb(0.88, 0.88, 0.95),
    borderWidth: 1,
});
if (isInstallmentInvoice) {
page.drawText("Project Budget", {
    x: cardX + 15,
    y: cardY - 20,
    size: 10,
    font: boldFont,
});

page.drawText(
    `Rs. ${projectBudget.toLocaleString("en-IN")}`,
    {
        x: cardX + 120,
        y: cardY - 20,
        size: 10,
        font: normalFont,
    }
);
page.drawText("Total Paid", {
    x: cardX + 15,
    y: cardY - 45,
    size: 10,
    font: boldFont,
});

page.drawText(
    `Rs. ${totalPaid.toLocaleString("en-IN")}`,
    {
        x: cardX + 120,
        y: cardY - 45,
        size: 10,
        font: normalFont,
    }
);
page.drawText("Outstanding", {
    x: cardX + 15,
    y: cardY - 70,
    size: 10,
    font: boldFont,
});

page.drawText(
    `Rs. ${outstanding.toLocaleString("en-IN")}`,
    {
        x: cardX + 120,
        y: cardY - 70,
        size: 10,
        font: normalFont,
    }
);
page.drawText("Status", {
    x: cardX + 15,
    y: cardY - 95,
    size: 10,
    font: boldFont,
});

const statusText =
    invoice.financialSummary.installmentStatus ??
    invoice.status ??
    "Pending";

const badgeColor =
    statusText === "Paid"
        ? rgb(0.13, 0.69, 0.29)
        : statusText === "Partially Paid"
        ? rgb(0.23, 0.52, 0.96)
        : rgb(0.98, 0.74, 0.14);
page.drawRectangle({
    x: cardX + 120,
    y: cardY - 102,
    width: 85,
    height: 18,
    color: badgeColor,
});
page.drawText(statusText, {
    x: cardX + 126,
    y: cardY - 97,
    size: 9,
    font: boldFont,
    color: rgb(1, 1, 1),
});

}
else{
page.drawText("Project Budget", {
    x: cardX + 15,
    y: cardY - 20,
    size: 10,
    font: boldFont,
});

page.drawText(
    `Rs. ${projectBudget.toLocaleString("en-IN")}`,
    {
        x: cardX + 120,
        y: cardY - 20,
        size: 10,
        font: normalFont,
    }
);
page.drawText("Invoice Amount", {
    x: cardX + 15,
    y: cardY - 45,
    size: 10,
    font: boldFont,
});

page.drawText(
    `Rs. ${invoiceAmount.toLocaleString("en-IN")}`,
    {
        x: cardX + 120,
        y: cardY - 45,
        size: 10,
        font: normalFont,
    }
);
page.drawText("Outstanding", {
    x: cardX + 15,
    y: cardY - 70,
    size: 10,
    font: boldFont,
});

page.drawText(
    `Rs. ${outstanding.toLocaleString("en-IN")}`,
    {
        x: cardX + 120,
        y: cardY - 70,
        size: 10,
        font: normalFont,
    }
);
page.drawText("Status", {
    x: cardX + 15,
    y: cardY - 95,
    size: 10,
    font: boldFont,
});
const statusText = invoice.status ?? "Pending";

const badgeColor =
    statusText === "Paid"
        ? rgb(0.13, 0.69, 0.29)
        : statusText === "Partially Paid"
        ? rgb(0.23, 0.52, 0.96)
        : rgb(0.98, 0.74, 0.14);
page.drawRectangle({
    x: cardX + 120,
    y: cardY - 102,
    width: 85,
    height: 18,
    color: badgeColor,
});
page.drawText(statusText, {
    x: cardX + 126,
    y: cardY - 97,
    size: 9,
    font: boldFont,
    color: rgb(1, 1, 1),
});
}
const footerY = 60;
page.drawLine({
    start: { x: 40, y: footerY + 35 },
    end: { x: width - 40, y: footerY + 35 },
    thickness: 1,
    color: rgb(0.88, 0.88, 0.88),
});
page.drawText("FlowSync", {
    x: 40,
    y: footerY + 15,
    size: 11,
    font: boldFont,
});
page.drawText(
    "AI-Powered Work Management",
    {
        x: 40,
        y: footerY,
        size: 9,
        font: normalFont,
    }
);
page.drawText(
    "This is a system generated invoice.",
    {
        x: 220,
        y: footerY,
        size: 9,
        font: normalFont,
        color: rgb(0.45, 0.45, 0.45),
    }
);
page.drawText("www.flowsynchub.co.in", {
    x: 430,
    y: footerY,
    size: 9,
    font: normalFont,
    color: rgb(0.25, 0.25, 0.25),
});
const pdfBytes = await pdfDoc.save();

return Buffer.from(pdfBytes);

}