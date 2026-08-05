import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function ReceiptPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {

    const { token } = await params;

    const invoice =
        await prisma.invoice.findFirst({

            where: {
                publicReceiptToken: token,
            },

            include: {
                client: true,
                project: true,
                paymentSchedules: true,
            },

        });

    if (!invoice) {
        notFound();
    }

    return (

        <div style={{ padding: 40 }}>

            <h1>Payment Receipt</h1>

            <p>
                Receipt: {invoice.invoiceNumber}
            </p>

            <p>
                Client: {invoice.client?.name}
            </p>

            <p>
                Amount: ₹{invoice.amount}
            </p>

        </div>

    );

}