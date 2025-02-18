import Transaction from "@/models/Transaction";
import { createDashboardData } from "../transactions/transactionsService";
import { SpankkiTransaction } from "@/types/spankki/spankki.types";
import { TransactionsData } from "@/types/types";

export const mapTransactionsToFitModel = async (
  transactionsData: SpankkiTransaction[]
): Promise<TransactionsData> => {
  const transactions: Transaction[] = transactionsData
    .map((transaction: SpankkiTransaction) => {
      const amountValue = transaction.Amount
        ? parseFloat(transaction.Amount.Amount)
        : 0;
      let total = amountValue;

      if (transaction.CreditDebitIndicator === "Debit") {
        if (
          transaction.BankTransactionCode?.Code === "CCRD" &&
          transaction.BankTransactionCode?.SubCode === "POSD"
        ) {
          total = -Math.abs(amountValue);
        } else {
          total = -Math.abs(amountValue);
        }
      } else if (transaction.CreditDebitIndicator === "Credit") {
        total = Math.abs(amountValue);
      }

      return Transaction.tryCreate({
        date_created: transaction.BookingDateTime,
        total: String(total),
        sender: transaction.DebtorAccount?.Name || "Unknown Sender",
        receiverNameOrTitle:
          transaction.CreditorAccount?.Name || "Unknown Receiver",
      });
    })
    .filter((transaction): transaction is Transaction => transaction !== null);

  const dashboardData = await createDashboardData(transactions, "spankki");

  return dashboardData;
};
