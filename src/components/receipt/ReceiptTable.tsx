interface Props {
    invoice: any;
}

export default function ReceiptTable({
    invoice,
}: Props) {

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

    return (

        <section className="px-10 pb-10">

            <div
                className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    shadow-sm
                "
            >

                {/* Table Header */}

                <div
                    className="
                        bg-gradient-to-r
                        from-indigo-600
                        via-violet-600
                        to-indigo-700
                        text-white
                    "
                >

                    <div
                        className="
                            grid
                            grid-cols-4
                            px-8
                            py-4
                            font-semibold
                            text-sm
                            tracking-wide
                        "
                    >

                        <div>Project</div>

                        <div className="text-center">

                            Qty

                        </div>

                        <div className="text-center">

                            Payment

                        </div>

                        <div className="text-right">

                            Amount

                        </div>

                    </div>

                </div>

                {/* Table Body */}

                <div className="bg-white">

                    <div
                        className="
                            grid
                            grid-cols-4
                            items-center
                            px-8
                            py-6
                            border-b
                        "
                    >

                        <div>

                            <h3
                                className="
                                    font-semibold
                                    text-slate-900
                                "
                            >

                                {invoice.project?.title}

                            </h3>

                        </div>

                        <div className="text-center">

    <span
        className="
            inline-flex
            items-center
            justify-center
            min-w-10
            h-10
            px-3
            rounded-full
            bg-indigo-100
            text-indigo-700
            text-base
            font-bold
            border
            border-indigo-200
            shadow-sm
        "
    >
        1
    </span>

                        </div>

                        <div className="text-center">

                            <span
className="
inline-flex
px-3
py-1
rounded-full
bg-indigo-50
text-indigo-700
text-sm
font-medium
"
>

Online

</span>

                        </div>

                        <div
                            className="
                                text-right
                                font-bold
                                text-green-600
                                text-lg
                            "
                        >

                            ₹
                            {amountPaid.toLocaleString("en-IN",{minimumFractionDigits: 2,})}

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}