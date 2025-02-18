import Transaction from "@/models/Transaction";
import Transactions from "@/models/Transactions";
import client from "@/lib/redisDb";
import { TransactionsData } from "@/types/types";

export const createDashboardData = async (
  transactions: Transaction[],
  fileName: string
): Promise<TransactionsData> => {
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

  const dashboardData: TransactionsData = {
    id: transactionsDataId,
    fileName,
    transactions,
    summary,
  };

  await client.hSet(transactionsDataId, {
    transactions: JSON.stringify(transactions),
    summary: JSON.stringify(summary),
    fileName,
    id: transactionsDataId,
  });

  await client.expire(transactionsDataId, 7200);

  return dashboardData;
};
