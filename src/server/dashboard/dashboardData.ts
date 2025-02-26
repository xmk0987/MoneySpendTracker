"use server";
import TransactionModel from "@/models/TransactionModel";
import TransactionsModel from "@/models/TransactionsModel";
import client from "@/lib/redisDb";
import { DashboardData } from "@/types/types";

export const createDashboardData = async (
  transactions: TransactionModel[],
  fileName: string
): Promise<DashboardData> => {
  const transactionsCollection = new TransactionsModel(transactions);

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

  const dashboardData: DashboardData = {
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
