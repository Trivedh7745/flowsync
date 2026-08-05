"use client";

import {
    Download,
    Printer,
    Share2,
} from "lucide-react";

interface Props {
    invoice: any;
}

export default function ReceiptActions({
    invoice,
}: Props) {

    const receiptNumber =
        invoice.invoiceNumber.replace(
            "INV",
            "REC"
        );

    const receiptUrl =
        `${window.location.origin}/r/${invoice.publicReceiptToken}`;

    const handleDownload = () => {

        window.open(
            `/api/invoices/receipt?id=${invoice.id}`,
            "_blank"
        );

    };

    const handlePrint = () => {

        window.print();

    };

    const handleShare = async () => {

        try {

            if (navigator.share) {

                await navigator.share({

                    title: receiptNumber,

                    text: "Payment Receipt",

                    url: receiptUrl,

                });

            } else {

                await navigator.clipboard.writeText(
                    receiptUrl
                );

                alert(
                    "Receipt link copied."
                );

            }

        } catch {

            // User cancelled

        }

    };

    return (

        <section className="px-10 pb-12">

            <div
                className="
                    flex
                    flex-wrap
                    justify-center
                    gap-5
                "
            >

                {/* Download */}

                <button
                    onClick={handleDownload}
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-2xl
                        px-8
                        py-4
                        text-white
                        font-semibold
                        bg-gradient-to-r
                        from-indigo-600
                        to-violet-600
                        hover:shadow-xl
                        hover:-translate-y-1
                        transition-all
                        duration-300
                    "
                >

                    <Download className="w-5 h-5" />

                    Download Receipt

                </button>

                {/* Print */}
                <button
    onClick={handlePrint}
    className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-300
        bg-white
        text-slate-700
        px-8
        py-4
        font-semibold
        shadow-sm
        hover:bg-slate-50
        hover:border-indigo-300
        hover:text-indigo-600
        hover:-translate-y-1
        transition-all
        duration-300
    "
>
    <Printer
        className="
            w-5
            h-5
            text-slate-600
        "
    />

    Print

</button>

                {/* Share */}

                <button
                    onClick={handleShare}
                     className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-slate-300
        bg-white
        text-slate-700
        px-8
        py-4
        font-semibold
        shadow-sm
        hover:bg-slate-50
        hover:border-indigo-300
        hover:text-indigo-600
        hover:-translate-y-1
        transition-all
        duration-300
    "
                >

                    <Share2 className="w-5 h-5" text-slate-600 />

                    Share

                </button>

            </div>

        </section>

    );

}