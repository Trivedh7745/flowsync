import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { generateReceiptPdf } from "@/lib/pdf/receipt";
import { buildFinancialSummary } from "@/lib/invoice";
import {
    getOrCreateReceiptToken,
} from "@/lib/pdf/receipt";

export async function POST(req: NextRequest) {

    try {
        
        const { invoiceId } = await req.json();

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

const {
    token,
    publicUrl,
} = await getOrCreateReceiptToken(
    invoice.id
);

console.log("Receipt Token:", token);
console.log("Public URL:", publicUrl);

const financialSummary =
    buildFinancialSummary(invoice);

const enrichedInvoice = {

    ...invoice,

    financialSummary,

};
const pdfBuffer =
    await generateReceiptPdf(
        enrichedInvoice
    );
const invoiceNumber =
    invoice.invoiceNumber ?? "INV-000";

const receiptNumber =
    invoiceNumber.replace("INV", "REC");

const amountPaid =
    financialSummary.totalPaid;

const formattedPaidDate =
    invoice.paidDate
        ? new Date(invoice.paidDate).toLocaleDateString(
              "en-IN",
              {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
              }
          )
        : "-";
const subject =

`Payment Receipt ${receiptNumber}`;
const iconUrl =
"https://flowsynchub.co.in/email/payment-received.png";

const html = `
<div
style="
font-family:Arial,sans-serif;
padding:32px;
max-width:650px;
margin:auto;
"
>
<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
background:#4F46E5;
border-radius:18px 18px 0 0;
"
>

<tr>

<td
style="
padding:32px;
color:white;
"
>

<div
style="
font-size:32px;
font-weight:700;
"
>

FlowSync

</div>

<div
style="
margin-top:8px;
font-size:16px;
opacity:.9;
"
>

AI-Powered Work Management

</div>

</td>

</tr>

</table>

<div
style="
padding:42px 42px 10px;
text-align:center;
">

<div
style="
margin-bottom:22px;
">

<img
src="${iconUrl}"
alt="Payment Received"
width="88"
height="88"
style="
display:block;
margin:0 auto;
"
/>

</div>

<h1
style="
margin:0;
font-size:34px;
font-weight:700;
color:#111827;
line-height:42px;
">

Payment Received

</h1>

<p
style="
margin:12px 0 0;
font-size:17px;
line-height:28px;
color:#6B7280;
">

Your payment has been successfully confirmed.

</p>

</div>

<div
style="
padding:0 42px;
font-size:16px;
line-height:30px;
color:#374151;
"
>

Hello
<strong>

${invoice.client?.name} 

</strong>,

<br><br>

Thank you for your payment!

We're pleased to let you know that your payment has been received successfully.

Your official payment receipt is attached to this email for your records.

We appreciate the opportunity to work with you and look forward to supporting your future projects with FlowSync.

</div>
<div
style="
margin:34px 40px 0;
font-size:13px;
letter-spacing:1px;
text-transform:uppercase;
color:#9CA3AF;
font-weight:600;
">

Transaction Summary

</div>
<div
style="
margin:36px 40px;
background:#FFFFFF;
border:1px solid #E5E7EB;
border-radius:18px;
overflow:hidden;
">

<div
style="
background:#F8FAFC;
padding:18px 24px;
border-bottom:1px solid #E5E7EB;
font-size:15px;
font-weight:700;
color:#4F46E5;
letter-spacing:.4px;
">

Payment Details

</div>


<div style="padding:24px;">

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
border-bottom:1px solid #F3F4F6;
padding:12px 0;
"
>

<tr>

<td
align="left"
style="
padding:12px 0;
color:#6B7280;
font-size:15px;
font-weight:500;
"
>

Receipt Number

</td>

<td
align="right"
style="
padding:12px 0;
color:#111827;
font-size:15px;
font-weight:600;
"
>

${receiptNumber}

</td>

</tr>

</table>

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
border-bottom:1px solid #F3F4F6;
padding:12px 0;
"
>

<tr>

<td
align="left"
style="
padding:12px 0;
color:#6B7280;
font-size:15px;
font-weight:500;
"
>

Invoice Number

</td>

<td
align="right"
style="
padding:12px 0;
color:#111827;
font-size:15px;
font-weight:600;
"
>

${invoice.invoiceNumber}

</td>

</tr>

</table>

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
border-bottom:1px solid #F3F4F6;
padding:12px 0;
"
>

<tr>

<td
align="left"
style="
padding:12px 0;
color:#6B7280;
font-size:15px;
font-weight:500;
"
>

Payment Received

</td>

<td
align="right"
style="
padding:12px 0;
color:#16A34A;
font-size:17px;
font-weight:700;
"
>

₹${amountPaid.toLocaleString("en-IN")}

</td>

</tr>

</table>
<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
border-bottom:1px solid #F3F4F6;
padding:12px 0;
"
>

<tr>

<td
align="left"
style="
padding:12px 0;
color:#6B7280;
font-size:15px;
font-weight:500;
"
>

Paid Date

</td>

<td
align="right"
style="
padding:12px 0;
color:#111827;
font-size:15px;
font-weight:600;
"
>

${formattedPaidDate}

</td>

</tr>

</table>

</div>
</div>

<div
style="
text-align:center;
margin:40px 0;
">

<a
href="https://flowsynchub.co.in"
style="
display:inline-block;
background:#4F46E5;
color:#FFFFFF;
padding:14px 34px;
border-radius:12px;
font-size:16px;
font-weight:600;
text-decoration:none;
box-shadow:0 6px 18px rgba(79,70,229,.25);
">

Manage Your Projects →

</a>

</div>
<div
style="
text-align:center;
padding:10px 40px 0;
color:#6B7280;
font-size:15px;
line-height:26px;
">

Have questions or need assistance?

Simply reply to this email—we're always happy to help.

</div>
<hr
style="
margin:42px 0 28px;
border:none;
border-top:1px solid #E5E7EB;
">

<div
style="
text-align:center;
padding-bottom:20px;
">

<div
style="
font-size:24px;
font-weight:700;
color:#111827;
">

FlowSync

</div>

<div
style="
margin-top:6px;
color:#6B7280;
font-size:15px;
">

AI-Powered Work Management

</div>

<div
style="
margin-top:16px;
">

<a
href="https://flowsynchub.co.in"
style="
color:#4F46E5;
text-decoration:none;
font-weight:600;
">

www.flowsynchub.co.in

</a>

</div>

<div
style="
margin-top:18px;
font-size:13px;
color:#9CA3AF;
">

© 2026 FlowSync. All rights reserved.

</div>

</div>

`;
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
await resend.emails.send({

    from:
        "FlowSync <billing@flowsynchub.co.in>",

    to:
        invoice.client.email,

    subject,

    html,

    attachments: [

        {

            filename:
                `${receiptNumber}.pdf`,

            content:
                pdfBuffer,

        },

    ],

});
console.log("Receipt generated:", pdfBuffer.length);
return NextResponse.json({

    success: true,

    publicUrl,

    message:
        "Receipt shared successfully.",

});
    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                error: "Unable to share receipt."
            },
            {
                status: 500
            }
        );

    }

}