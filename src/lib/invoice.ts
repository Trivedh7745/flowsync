import { buildFinancialSummary } from "@/lib/invoice";

export function buildFinancialSummary(invoice: any) {

    const projectBudget =
        Number(invoice.project?.budget ?? 0);

    const totalPaid =
        invoice.paymentSchedules.reduce(
            (sum: number, payment: any) =>
                payment.paidDate
                    ? sum + Number(payment.amount)
                    : sum,
            0
        );

    const outstandingBalance =
        Math.max(projectBudget - totalPaid, 0);

    const currentInstallment =
        invoice.paymentSchedules.find(
            (payment: any) => !payment.paidDate
        );

    return {

        projectBudget,

        totalPaid,

        outstandingBalance,

        currentInstallment,

        installmentStatus:
            currentInstallment
                ? "Pending"
                : "Paid",

    };

}