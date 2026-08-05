import { CheckCircle2 } from "lucide-react";

export default function ReceiptHeader() {

    return (

        <div
            className="
                bg-gradient-to-r
                from-indigo-600
                via-violet-600
                to-indigo-700
                rounded-t-3xl
                px-10
                py-8
                flex
                items-center
                justify-between
            "
        >

            <div>

                <h1
                    className="
                        text-4xl
                        font-bold
                        text-white
                    "
                >

                    FlowSync

                </h1>

                <p
                    className="
                        text-indigo-100
                        mt-2
                    "
                >

                    AI-Powered Work Management

                </p>

            </div>

            <div
                className="
                    bg-green-500/20
                    border
                    border-green-300/40
                    backdrop-blur
                    rounded-full
                    px-5
                    py-2
                    flex
                    items-center
                    gap-2
                "
            >

                <CheckCircle2
                    className="
                        w-5
                        h-5
                        text-green-300
                    "
                />

                <span
                    className="
                        text-white
                        font-semibold
                    "
                >

                    VERIFIED

                </span>

            </div>

        </div>

    );

}