import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface PageProps {
    params: {
        token: string;
    };
}

export default async function ReceiptPage({
    params,
}: PageProps) {

    const invoice =
        await prisma.invoice.findFirst({

            where: {
                publicReceiptToken: params.token,
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
                Receipt:
                {" "}
                {invoice.invoiceNumber}
            </p>

            <p>
                Client:
                {" "}
                {invoice.client?.name}
            </p>

            <p>
                Amount:
                {" "}
                ₹{invoice.amount}
            </p>

        </div>

    );

}