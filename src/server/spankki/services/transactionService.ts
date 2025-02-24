import TransactionModel from "@/models/TransactionModel";
import { createDashboardData } from "../../dashboard/dashboardData";
import { SpankkiTransaction } from "@/types/spankki.types";
import { TransactionsData } from "@/types/types";

export const mapSpankkiTransactionsToModel = async (
  transactionsData: SpankkiTransaction[]
): Promise<TransactionsData> => {
  const transactions: TransactionModel[] = transactionsData
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

      return TransactionModel.tryCreate({
        date_created: transaction.BookingDateTime,
        total: String(total),
        sender: transaction.DebtorAccount?.Name || "Unknown Sender",
        receiverNameOrTitle:
          transaction.CreditorAccount?.Name || "Unknown Receiver",
      });
    })
    .filter(
      (transaction): transaction is TransactionModel => transaction !== null
    );

  const dashboardData = await createDashboardData(transactions, "spankki");

  return dashboardData;
};
