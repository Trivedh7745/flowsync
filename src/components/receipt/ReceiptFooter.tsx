import {
    ShieldCheck,
    Globe,
    Mail,
} from "lucide-react";

export default function ReceiptFooter() {

    return (

        <footer
            className="
                mt-4
                border-t
                border-slate-200
                bg-slate-50
                rounded-b-3xl
            "
        >

            <div
                className="
                    px-10
                    py-8
                    flex
                    flex-col
                    md:flex-row
                    justify-between
                    items-center
                    gap-8
                "
            >

                {/* Left */}

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

                    <p
                        className="
                            mt-2
                            text-slate-500
                        "
                    >

                        AI-Powered Work Management

                    </p>

                    <div
                        className="
                            mt-4
                            flex
                            items-center
                            gap-2
                            text-green-600
                            text-sm
                            font-medium
                        "
                    >

                        <ShieldCheck
                            className="
                                w-4
                                h-4
                            "
                        />

                        Securely verified receipt

                    </div>

                </div>

                {/* Right */}

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        md:items-end
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-slate-600
                        "
                    >

                        <Globe
                            className="
                                w-4
                                h-4
                            "
                        />

                        <a
                            href="https://flowsynchub.co.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                hover:text-indigo-600
                                transition-colors
                            "
                        >

                            flowsynchub.co.in

                        </a>

                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-slate-600
                        "
                    >

                        <Mail
                            className="
                                w-4
                                h-4
                            "
                        />

                        billing@flowsynchub.co.in

                    </div>

                    <p
                        className="
                            text-sm
                            text-slate-400
                        "
                    >

                        © {new Date().getFullYear()} FlowSync.
                        All rights reserved.

                    </p>

                </div>

            </div>

        </footer>

    );

}