import Transaction from "@/models/Transaction";
import Transactions from "@/models/Transactions";
import client from "@/lib/redisDb";

export const createTransactionsData = async (
  transactions: Transaction[],
  fileName: string
) => {
  const transactionsCollection = new Transactions(transactions);

  const summary = {
    totalCount: transactionsCollection.countTotal(),
    totalSpend: transactionsCollection.getTotalSpend(),
    totalReceived: transactionsCollection.getTotalReceived(),
    budgets: {
      yearlyAggregates: transactionsCollection.getYearlyBudgets(),
      monthlyAggregates: transactionsCollection.getMonthlyBudgets(),
      dailyAggregates: transactionsCollection.getDailyBudgets(),
    },
    categories: {
      receiverNameOrTitle:
        transactionsCollection.getReceiverNameOrTitleCategory(),
    },
    timeline: transactionsCollection.getTimeline(),
  };

  const transactionsDataId = crypto.randomUUID();

  await client.hSet(transactionsDataId, {
    transactions: JSON.stringify(transactions),
    summary: JSON.stringify(summary),
    fileName: fileName,
  });

  await client.expire(transactionsDataId, 7200);

  return transactionsDataId;
};
