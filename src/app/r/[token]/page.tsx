import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PublicReceipt from "@/components/receipt/PublicReceipt";

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

         <PublicReceipt
        invoice={invoice}
    />

    );

}