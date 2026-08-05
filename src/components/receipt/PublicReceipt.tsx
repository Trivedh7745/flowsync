import ReceiptHeader from "./ReceiptHeader";
import ReceiptSummary from "./ReceiptSummary";
import ReceiptCompany from "./ReceiptCompany";
import ReceiptNotes from "./ReceiptNotes";
import ReceiptTable from "./ReceiptTable";
import ReceiptActions from "./ReceiptActions";
import ReceiptFooter from "./ReceiptFooter";

interface Props {

    invoice: any;

}

export default function PublicReceipt({

    invoice,

}: Props) {

    return (

        <main
            className="
                min-h-screen
                bg-slate-100
                py-12
                px-6
            "
        >

            <div
                className="
                    max-w-6xl
                    mx-auto
                    rounded-3xl
                    overflow-hidden
                    shadow-2xl
                    bg-white
                "
            >

                <ReceiptHeader />

                <div
                    className="
                        py-10
                        text-center
                    "
                >
                    <img
    src="/email/payment-received.png"
    alt="Payment Received"
    className="
        w-26
        h-26
        object-contain
        mx-auto
        mb-6
        select-none
        pointer-events-none
    "
/>

                    <h2
                        className="
                            text-4xl
                            font-bold
                            text-slate-900
                        "
                    >

                        Payment Successfully Received

                    </h2>

                    <p
                        className="
                            mt-4
                            text-slate-500
                            text-lg
                        "
                    >

                        This payment has been securely verified
                        by FlowSync.

                    </p>

                </div>

                <ReceiptSummary
                    invoice={invoice}
                />

                <ReceiptCompany
                  invoice={invoice}
                />

                <ReceiptTable
                 invoice={invoice}
                />
                <div
    className="
        mx-10
        border-t
        border-slate-200
    "
/>

                <ReceiptNotes
                />

                <ReceiptActions
                  invoice={invoice}
                />
    
                <ReceiptFooter />
                

            </div>

        </main>

    );

}