import {
    Building2,
    User,
    Mail,
    Globe,
} from "lucide-react";

interface Props {
    invoice: any;
}

export default function ReceiptCompany({
    invoice,
}: Props) {

    return (

        <section className="px-10 pb-10">

            <div
                className="
                    bg-white
                    border
                    border-slate-200
                    rounded-3xl
                    p-8
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-300
                "
            >

                <div
                    className="
                        grid
                        md:grid-cols-[1fr_auto_1fr]
                        gap-10
                        items-start
                    "
                >

                    {/* FROM */}

                    <div>

                        <p
                            className="
                                text-xs
                                font-bold
                                tracking-[0.25em]
                                text-indigo-600
                                uppercase
                                mb-6
                            "
                            
                        >

                            FROM

                        </p>

                        <div className="space-y-4">

                            <div className="flex items-start gap-5">

                                <div
                                    className="
                                        w-11
                                        h-11
                                        rounded-xl
                                        bg-gradient-to-br
                                        from-indigo-50
                                        to-violet-100
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <Building2
                                        className="
                                            w-5
                                            h-5
                                            text-indigo-600
                                        "
                                    />

                                </div>

                                <div>

                                    <h3
                                        className="
                                            text-xl
                                            font-bold
                                            text-slate-900
                                        "
                                    >

                                        FlowSync

                                    </h3>

                                    <p className="text-slate-500">

                                        AI-Powered Work Management

                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-3">

                                <Mail
                                    className="
                                        w-5
                                        h-5
                                        text-slate-400
                                        mt-0.5
                                    "
                                />

                                <span className="text-slate-600">

                                    billing@flowsynchub.co.in

                                </span>

                            </div>

                            <div className="flex gap-3">

                                <Globe
                                    className="
                                        w-5
                                        h-5
                                        text-slate-400
                                        mt-0.5
                                    "
                                />

                                <span className="text-slate-600">

                                    flowsynchub.co.in

                                </span>

                            </div>

                        </div>

                    </div>

                    <div
        className="
            hidden
            md:flex
            justify-center
            h-full
        "
    >

        <div
            className="
                w-px
                h-full
                bg-slate-200
            "
        />

    </div>

                    {/* BILL TO */}

                    <div>

                        <p
                            className="
                                text-xs
                                font-bold
                                tracking-[0.25em]
                                text-indigo-600
                                uppercase
                                mb-6
                            "
                        >

                            BILL TO

                        </p>

                        <div className="space-y-4">

                            <div className="flex items-start gap-5">

                                <div
                                    className="
                                        w-11
                                        h-11
                                        rounded-xl
                                        bg-gradient-to-br
                                        from-indigo-50
                                        to-violet-100
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >

                                    <User
                                        className="
                                            w-5
                                            h-5
                                            text-indigo-600
                                        "
                                    />

                                </div>

                                <div>

                                    <h3
                                        className="
                                            text-xl
                                            font-bold
                                            text-slate-900
                                        "
                                    >

                                        {invoice.client?.name}

                                    </h3>

                                    <p className="text-slate-500">

                                        {invoice.client?.company ||
                                            "No Company"}

                                    </p>

                                </div>

                            </div>

                            <div className="flex gap-3">

                                <Mail
                                    className="
                                        w-5
                                        h-5
                                        text-slate-400
                                        mt-0.5
                                    "
                                />

                                <span className="text-slate-600">

                                    {invoice.client?.email}

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}