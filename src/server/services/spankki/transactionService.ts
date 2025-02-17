import Transaction from "@/models/Transaction";
import { createTransactionsData } from "../transactions/transactionsService";

export const mapTransactionsToFitModel = async (transactionsData: any) => {
  const transactions = transactionsData.map((transaction: any) => {
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
  });

  const transactionsDataId = await createTransactionsData(
    transactions,
    "spankki"
  );

  return transactionsDataId;
};
