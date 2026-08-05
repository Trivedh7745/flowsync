import {
    Calendar,
    CreditCard,
    FileText,
    Receipt,
} from "lucide-react";
import { buildFinancialSummary } from "@/lib/invoice";

interface Props {

    invoice: any;

}

export default function ReceiptSummary({

    invoice,

}: Props) {

    const receiptNumber =
        invoice.invoiceNumber.replace(
            "INV",
            "REC"
        );

    const paidDate =
        invoice.paidDate
            ? new Date(
                  invoice.paidDate
              ).toLocaleDateString(
                  "en-IN"
              )
            : "-";

const amountPaid =
    invoice.paymentSchedule
        ? invoice.paymentSchedules.reduce(
              (sum: number, payment: any) =>
                  payment.paidDate
                      ? sum + Number(payment.amount)
                      : sum,
              0
          )
        : Number(invoice.amount);

    const cards = [

        {
            title: "Receipt Number",
            value: receiptNumber,
            icon: Receipt,
        },

        {
            title: "Invoice Number",
            value: invoice.invoiceNumber,
            icon: FileText,
        },

        {
            title: "Paid Date",
            value: paidDate,
            icon: Calendar,
        },

        {
            title: "Amount Paid",
            value: `₹${amountPaid.toLocaleString(
                "en-IN"
            )}`,
            icon: CreditCard,
            green: true,
        },

    ];

    return (

        <div
            className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-4
                gap-6
                p-10
            "
        >

            {cards.map((card) => {

                const Icon =
                    card.icon;

                return (

                    <div
                        key={card.title}
                        className="
bg-gradient-to-br
from-white
to-slate-50
border
border-slate-200
rounded-3xl
p-6
shadow-sm
hover:shadow-lg
hover:-translate-y-1
transition-all
duration-300
"
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                                mb-5
                            "
                        >

                            <div
                                className="
                                    w-11
                                    h-11
                                    rounded-xl
                                    bg-indigo-50
                                    flex
                                    items-center
                                    justify-center
                                "
                            >

                                <Icon
                                    className="
                                        w-5
                                        h-5
                                        text-indigo-600
                                    "
                                />

                            </div>

                            <p
                                className="
                                    text-sm
                                    text-slate-500
                                "
                            >

                                {card.title}

                            </p>

                        </div>

                        <h3
                            className={`
                                text-lg
                                font-bold
                                ${
                                    card.green
                                        ? "text-green-600"
                                        : "text-slate-900"
                                }
                            `}
                        >

                            {card.value}

                        </h3>

                    </div>

                );

            })}

        </div>

    );

}