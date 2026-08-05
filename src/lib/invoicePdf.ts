import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function generateInvoicePDF(invoice: any) {

    try {

        const doc = new jsPDF({

            orientation: "portrait",

            unit: "mm",

            format: "a4",

        });

        // ==================================
        // HEADER
        // ==================================

        doc.setTextColor(20, 120, 180);

        doc.setFont("helvetica", "bold");

        doc.setFontSize(28);

        doc.text(

            "FlowSync",

            15,

            20

        );

        doc.setTextColor(80);

        doc.setFont("helvetica", "normal");

        doc.setFontSize(11);

        doc.text(

            "AI-Powered Work Management",

            15,

            28

        );

        // ==================================
        // COMPANY DETAILS
        // ==================================

        doc.setFontSize(10);

        doc.text(

            "123 Innovation Street",

            15,

            40

        );

        doc.text(

            "Hyderabad, Telangana",

            15,

            46

        );

        doc.text(

            "+91 9876543210",

            15,

            52

        );

        doc.text(

            "hello@flowsync.com",

            15,

            58

        );

        doc.text(

            "www.flowsync.com",

            15,

            64

        );

        // ==================================
        // RIGHT SIDE TITLE
        // ==================================

        doc.setTextColor(20, 120, 180);

        doc.setFont("helvetica", "bold");

        doc.setFontSize(36);

        doc.text(

            "INVOICE",

            135,

            25

        );

        // ==================================
        // DIVIDER
        // ==================================

        doc.setDrawColor(20, 120, 180);

        doc.setLineWidth(0.8);

        doc.line(

            15,

            72,

            195,

            72

        );

        // ==================================
        // TEMPORARY INVOICE DATA
        // (Will replace with professional layout next)
        // ==================================

        // ==================================
// INVOICE DETAILS
// ==================================

doc.setTextColor(20,120,180);

doc.setFont("helvetica","bold");

doc.setFontSize(12);

doc.text("Invoice ID",15,85);
doc.text("Issue Date",15,94);
doc.text("Due Date",15,103);
doc.text("Project",15,112);

doc.setTextColor(40);

doc.setFont("helvetica","normal");

doc.text(

    `: ${invoice.invoiceNumber}`,

    52,

    85

);

doc.text(

    `: ${
        invoice.issueDate
            ? new Date(invoice.issueDate).toLocaleDateString("en-GB")
            : "-"
    }`,

    52,

    94

);

doc.text(

    `: ${
        invoice.dueDate
            ? new Date(invoice.dueDate).toLocaleDateString("en-GB")
            : "-"
    }`,

    52,

    103

);

doc.text(

    `: ${invoice.project?.title ?? "-"}`,

    52,

    112

);
// ==================================
// CLIENT DETAILS
// ==================================

doc.setTextColor(20,120,180);

doc.setFont("helvetica","bold");

doc.text("Client",120,85);
doc.text("Email",120,94);
doc.text("Company",120,103);

doc.setTextColor(40);

doc.setFont("helvetica","normal");

doc.text(

    `: ${invoice.client?.name ?? "-"}`,

    150,

    85

);

doc.text(

    `: ${invoice.client?.email ?? "-"}`,

    150,

    94

);

doc.text(

    `: ${invoice.client?.company ?? "-"}`,

    150,

    103

);
doc.setDrawColor(200);

doc.line(

    15,

    122,

    195,

    122

);
autoTable(doc, {

    startY: 130,

    theme: "grid",

    styles: {

        font: "helvetica",

        fontSize: 10,

        cellPadding: 5,

        lineWidth: 0.2,

        lineColor: [220,220,220],

    },

    headStyles: {

        fillColor: [20,120,180],

        textColor: 255,

        fontStyle: "bold",

        halign: "center",

        valign: "middle",

    },

    alternateRowStyles: {

        fillColor: [248,250,252],

    },

    columnStyles: {

        0: {

            halign: "left",

            cellWidth: 75,

        },

        1: {

            halign: "center",

            cellWidth: 20,

        },

        2: {

            halign: "right",

            cellWidth: 40,

        },

        3: {

            halign: "right",

            cellWidth: 40,

        },

    },

    head: [[

        "Description",

        "Qty",

        "Rate",

        "Amount"

    ]],

    body: [[

        invoice.project?.title ?? "-",

        "1",

        "Rs. " + Number(invoice.amount).toLocaleString("en-IN"),

        "Rs. " + Number(invoice.amount).toLocaleString("en-IN")

    ]],

});
const finalY =
    (doc as any).lastAutoTable.finalY + 15;

// ==================================
// NOTES
// ==================================

doc.setFont("helvetica", "bold");

doc.setFontSize(12);

doc.setTextColor(20,120,180);

doc.text(

    "Notes",

    15,

    finalY

);

doc.setFont("helvetica", "normal");

doc.setTextColor(60);

doc.setFontSize(10);

doc.text(

    "Thank you for choosing FlowSync.",

    15,

    finalY + 8

);
// ==================================
// SUMMARY BOX
// ==================================

const summaryX = 115;

const summaryY = finalY;

doc.setDrawColor(210);

doc.roundedRect(

    summaryX,

    summaryY - 5,

    80,

    48,

    2,

    2

);

const projectBudget =
    Number(invoice.project?.budget ?? 0);

const invoiceAmount =
    Number(invoice.amount);

const outstanding =
    projectBudget - invoiceAmount;

doc.setFont("helvetica","bold");

doc.setFontSize(10);

doc.setTextColor(40);

doc.text(

    "Project Budget",

    120,

    summaryY + 5

);

doc.text(

    "Invoice Amount",

    120,

    summaryY + 15

);

doc.text(

    "Outstanding",

    120,

    summaryY + 25

);

doc.setFont("helvetica","normal");

doc.text(

    `Rs. ${projectBudget.toLocaleString("en-IN")}`,

    185,

    summaryY + 5,

    { align: "right" }

);

doc.text(

    `Rs. ${invoiceAmount.toLocaleString("en-IN")}`,

    185,

    summaryY + 15,

    { align: "right" }

);

doc.text(

    `Rs. ${outstanding.toLocaleString("en-IN")}`,

    185,

    summaryY + 25,

    { align: "right" }

);

doc.setDrawColor(220);

doc.line(

    120,

    summaryY + 32,

    190,

    summaryY + 32

);

doc.setFont("helvetica","bold");

doc.setTextColor(20,120,180);

const statusColor =

    invoice.status === "Paid"

        ? [34,197,94]

    : invoice.status === "Partially Paid"

        ? [245,158,11]

    : invoice.status === "Sent"

        ? [59,130,246]

    : [156,163,175];

doc.text(

    "Status",

    120,

    summaryY + 40

);

doc.setFillColor(

    statusColor[0],

    statusColor[1],

    statusColor[2]

);

doc.roundedRect(

    150,

    summaryY + 34,

    38,

    9,

    2,

    2,

    "F"

);

doc.setTextColor(255);

doc.setFontSize(9);

doc.setFont("helvetica","bold");

doc.text(

    invoice.status.toUpperCase(),

    169,

    summaryY + 40,

    {

        align:"center"

    }

);

const footerY = Math.max(

    finalY + 65,

    250

);

doc.setDrawColor(20,120,180);

doc.setLineWidth(0.6);

doc.line(

    15,

    footerY,

    195,

    footerY

);
doc.setTextColor(20,120,180);

doc.setFont("helvetica","bold");

doc.setFontSize(18);

doc.text(

    "FlowSync",

    15,

    footerY + 10

);

doc.setFontSize(10);

doc.setFont("helvetica","normal");

doc.setTextColor(80);

doc.text(

    "AI-Powered Work Management",

    15,

    footerY + 17

);
doc.setFontSize(10);

doc.text(

    "This is a system generated invoice.",

    120,

    footerY + 10

);

doc.text(

    "Thank you for choosing FlowSync.",

    120,

    footerY + 17

);
doc.setTextColor(20,120,180);

doc.text(

    "www.flowsync.com",

    15,

    footerY + 25

);
// ==================================
// DOWNLOAD PDF
// ==================================

console.log("Downloading PDF...");

doc.save(

    `${invoice.invoiceNumber}.pdf`

);

console.log("PDF Download Complete.");

    } catch (error) {

        console.error("PDF Error:", error);

    }

}