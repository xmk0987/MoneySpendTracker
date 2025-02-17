import Transaction from "@/models/Transaction";
import { processTransactionsData } from "../transactions/transactionsService";

export const mapTransactionsToFitModel = async (transactionsData: any) => {
  console.log("One transaction", transactionsData[0]);
  const transactions = transactionsData.map((transaction: any) => {
    return Transaction.tryCreate({
      date_created: transaction.BookingDateTime,
      total: transaction.Amount.Amount,
      sender: transaction.DebtorAccount?.Name || "Unknown Sender",
      receiverNameOrTitle:
        transaction.CreditorAccount?.Name || "Unknown Receiver",
    });
  });

  const transactionsDataId = await processTransactionsData(
    transactions,
    "spankki"
  );

  return transactionsDataId;
};
