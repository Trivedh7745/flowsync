import { BadgeCheck } from "lucide-react";

export default function ReceiptNotes() {

    return (

        <section className="px-10 py-8">

            <div
                className="
                    flex
                    flex-col
                    md:flex-row
                    justify-between
                    items-center
                    gap-10
                "
            >

                {/* Left */}

                <div className="flex-1">

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            mb-4
                        "
                    >

                        <BadgeCheck
                            className="
                                w-7
                                h-7
                                text-green-600
                            "
                        />

                        <h3
                            className="
                                text-2xl
                                font-bold
                                text-slate-900
                            "
                        >

                            Payment Verified

                        </h3>

                    </div>

                    <p
                        className="
                            text-slate-600
                            leading-8
                            max-w-xl
                        "
                    >

                        This payment has been successfully received
                        and securely verified by FlowSync.

                    </p>

                    <p
                        className="
                            mt-4
                            text-slate-500
                        "
                    >

                        Thank you for choosing FlowSync.

                    </p>

                </div>

                {/* Paid Stamp */}

                <div
                     className="
shrink-0
"
                >

                    <img
                        src="/Stamp.png"
                        alt="Paid Stamp"
                        className="
                            w-44
                            opacity-80
                            rotate-[-10deg]
                            select-none
                            pointer-events-none
                        "
                    />

                </div>

            </div>

        </section>

    );

}