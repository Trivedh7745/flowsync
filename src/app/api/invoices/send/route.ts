import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { generateInvoicePdf } from "@/lib/pdf/invoice";
import { generateReceiptPdf } from "@/lib/pdf/receipt";
import fs from "fs/promises";
import path from "path";
import { buildFinancialSummary } from "@/lib/invoice";

export async function POST(req: NextRequest) {
    try {
        const { invoiceId } = await req.json();

        if (!invoiceId) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invoice ID is required.",
                },
                {
                    status: 400,
                }
            );
        }

        const invoice = await prisma.invoice.findUnique({
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
                    success: false,
                    error: "Invoice not found.",
                },
                {
                    status: 404,
                }
            );
        }
const isResend = invoice.emailSent;
const financialSummary = buildFinancialSummary(invoice);

const enrichedInvoice = {
    ...invoice,
    financialSummary,
};
const pdfBuffer = await generateInvoicePdf(enrichedInvoice);

console.log("PDF saved successfully");

console.log("PDF generated successfully");
console.log("Buffer Size:", pdfBuffer.length);
const formattedDueDate = invoice.dueDate
    ? new Date(invoice.dueDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
      })
    : "Not Specified";
let statusColor = "#3B82F6";

switch (invoice.status) {

    case "Paid":

        statusColor = "#22C55E";

        break;

    case "Partially Paid":

        statusColor = "#F59E0B";

        break;

    case "Pending":

    case "Sent":

        statusColor = "#3B82F6";

        break;

}
const clientEmail = invoice.client?.email ?? "-";
const isInstallmentInvoice =
    invoice.paymentSchedules &&
    invoice.paymentSchedules.length > 0;
const introMessage = isInstallmentInvoice
    ? `
        We hope you're doing well.<br><br>

        Your next <strong>installment invoice</strong> for the project
        <strong>${invoice.project?.title}</strong> is ready and has been attached to this email.<br><br>

        Please complete this installment before the due date to keep your project progressing smoothly.
      `
    : `
        We hope you're doing well.<br><br>

        Your invoice is ready and has been attached to this email.<br><br>

        Please review it and complete the payment before the due date.
      `;

const statusStyles = {
    Paid: {
        bg: "#DCFCE7",
        text: "#15803D",
    },
    "Partially Paid": {
        bg: "#DBEAFE",
        text: "#2563EB",
    },
    Pending: {
        bg: "#FEF3C7",
        text: "#D97706",
    },
    Draft: {
        bg: "#F3F4F6",
        text: "#6B7280",
    },
};

const badge =
    statusStyles[
        invoice.status as keyof typeof statusStyles
    ] ??
    statusStyles.Pending;

const projectBudget =
    financialSummary.projectBudget;

const totalPaid =
    financialSummary.totalPaid;

const outstanding =
    financialSummary.outstandingBalance;
const emailSummary = isInstallmentInvoice
    ? [
          {
              label: "Invoice Number",
              value: invoice.invoiceNumber,
          },
          {
              label: "Project",
              value: invoice.project?.title ?? "-",
          },
          {
              label: "Current Installment",
              value: `Rs. ${Number(invoice.amount).toLocaleString("en-IN")}`,
          },
          {
              label: "Outstanding Balance",
              value: `Rs. ${outstanding.toLocaleString("en-IN")}`,
          },
          {
              label: "Due Date",
              value: formattedDueDate,
          },
      ]
    : [
          {
              label: "Invoice Number",
              value: invoice.invoiceNumber,
          },
          {
              label: "Project",
              value: invoice.project?.title ?? "-",
          },
          {
              label: "Amount Due",
              value: `Rs. ${Number(invoice.amount).toLocaleString("en-IN")}`,
          },
          {
              label: "Due Date",
              value: formattedDueDate,
          },
      ];
const emailSummaryRows = emailSummary
    .map(
        (item) => `
<tr>
    <td
        style="
            padding:16px 0;
            color:#666;
            font-size:15px;
            font-weight:500;
        "
    >
        ${item.label}
    </td>

    <td
        align="right"
        style="
            padding:16px 0;
            color:#222;
            font-size:15px;
            font-weight:600;
        "
    >
        ${
item.label === "Current Installment"
    ? `<span
        style="
            color:#6D28D9;
            font-size:17px;
            font-weight:700;
        ">
        ${item.value}
       </span>`
    : item.value
}
    </td>
</tr>
`
    )
    .join("");
if (!resend) {

    return NextResponse.json(
        {
            error: "Resend is not configured.",
        },
        {
            status: 500,
        }
    );

}
const emailResponse = await resend.emails.send({
 attachments: [
    {
        filename: `${invoice.invoiceNumber}.pdf`,
        content: pdfBuffer,
    },
],
  from: "FlowSync Billing <billing@flowsynchub.co.in>",
  to: clientEmail,
  subject: isInstallmentInvoice
    ? `Installment Invoice ${invoice.invoiceNumber} from FlowSync`
    : `Invoice ${invoice.invoiceNumber} from FlowSync`,
  html: `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8"/>

</head>

<body
style="
margin:0;
padding:0;
background:#f4f7fb;
font-family:Arial,sans-serif;
">

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="padding:40px 0;"
>

<tr>

<td align="center">

<table
width="650"
cellpadding="0"
cellspacing="0"
style="
background:white;
border-radius:16px;
overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,.08);
"
>

<!-- HEADER -->

<tr>

<td
style="
background:linear-gradient(135deg,#6C3BFF,#8B5CF6);
padding:40px;
text-align:center;
">

<div
style="
width:64px;
height:64px;
background:white;
border-radius:16px;
margin:auto;
font-size:36px;
font-weight:bold;
line-height:64px;
color:#6C3BFF;
">

F

</div>

<h1
style="
color:white;
margin-top:20px;
margin-bottom:5px;
font-size:30px;
">

FlowSync

</h1>

</td>

</tr>

<tr>

<td
style="
padding:40px;
">

<h2
style="
margin-top:0;
font-size:24px;
color:#222;
">

Hello ${invoice.client.name} 👋

</h2>

<p
style="
font-size:16px;
line-height:28px;
color:#555;
">

${introMessage}

</p>
<p
style="
font-size:15px;
line-height:24px;
color:#555;
margin-top:18px;
">

📎 <strong>Your invoice is attached to this email</strong> as
<b>${invoice.invoiceNumber}.pdf</b>.

You can also manage this invoice online using your FlowSync workspace.

</p>

</td>

</tr>

<tr>

<td
style="
padding:0 40px 30px;
">

<table
width="100%"
style="
border:1px solid #eee;
border-radius:12px;
padding:20px;
"
>

${emailSummaryRows}

<tr>
<td colspan="2">

<div
style="
height:1px;
background:#ECECEC;
margin:12px 0;
">
</div>

</td>
</tr>
<tr>

<td
style="padding:12px 0;
color:#666;
">

<b>Status</b>

</td>

<td align="right"
style="
font-weight:bold;
color: ${statusColor};
">

<span
style="
display:inline-block;
padding:7px 14px;
border-radius:999px;
background:${badge.bg};
color:${badge.text};
font-size:13px;
font-weight:700;
">
${invoice.status}
</span>

</td>

</tr>

</table>

</td>

</tr>

<table
width="100%"
style="
background:#FFF8E7;
border:1px solid #F4D37A;
border-radius:10px;
padding:18px;
margin:25px 0;
">

<tr>

<td>

<p
style="
margin:0;
font-size:15px;
color:#8A6D1F;
">

<strong>Payment Reminder</strong>

</p>
<p
style="
margin-top:10px;
font-size:14px;
line-height:24px;
color:#7A6320;
">

Kindly review the attached invoice and complete the payment by

<strong>${formattedDueDate}</strong>.

<br/><br/>

If payment has already been made, you can safely disregard this reminder.

</p>

</td>

</tr>

</table>

<tr>

<td
align="center"
style="
padding-bottom:40px;
">

<a
href="https://flowsynchub.co.in"

style="
display:inline-block;
padding:16px 36px;
background:#6C3BFF;
color:white;
text-decoration:none;
font-weight:bold;
border-radius:12px;
font-size:16px;
box-shadow:0 10px 20px rgba(108,59,255,.25);
">

Manage Invoice →

</a>

</td>

</tr>
<tr>

<td
style="
padding:30px;
background:#fafafa;
text-align:center;
">

<hr
style="
border:none;
border-top:1px solid #eee;
margin:30px 0;
"/>

<h3
style="
margin-bottom:10px;
color:#333;
">

Need Assistance?

</h3>

<p
style="
font-size:14px;
line-height:24px;
color:#666;
">

Have questions about this invoice?

<br/><br/>

Simply reply to this email or contact our billing team.

</p>

<p
style="
font-weight:bold;
color:#6C3BFF;
">

billing@flowsynchub.co.in

</p>
<p
style="
font-size:14px;
color:#777;
">

Thank you for choosing FlowSync.

We appreciate your business and look forward to working with you again.

</p>

<p
style="
font-size:12px;
color:#BBB;
">

© 2026 FlowSync

<br>

AI-Powered Work Management

</p>

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`
  
});

console.log("RESEND RESPONSE:", JSON.stringify(emailResponse, null, 2));
if (emailResponse.error) {
    return NextResponse.json(
        {
            success: false,
            error: emailResponse.error,
        },
        {
            status: 500,
        }
    );
}
const updatedInvoice = await prisma.invoice.update({
    where: {
        id: invoice.id,
    },

    data: {
    emailSent: true,

    status:
        invoice.status === "Draft"
            ? "Sent"
            : invoice.status,
    paidDate: new Date(),

    sentAt: invoice.sentAt ?? new Date(),

    lastSentAt: new Date(),
    },

    include: {
        client: true,
        project: true,
        paymentSchedules: true,
    },
});
return NextResponse.json({
    success: true,
    resend: isResend,
    invoice: updatedInvoice,
});
    } catch (error) {
        console.error("SEND EMAIL ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Failed to send email.",
            },
            {
                status: 500,
            }
        );
    }
}