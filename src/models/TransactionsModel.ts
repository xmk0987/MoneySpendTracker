import { calculateSimilarityDiceCoefficient } from "@/utils/stringSimilarity";
import TransactionModel from "./TransactionModel";
import { getISOWeek, toLocalDateString } from "@/utils/dates";

export default class TransactionsModel {
  private transactions: TransactionModel[];

  constructor(transactions: TransactionModel[]) {
    this.transactions = transactions;
  }

  countTotal(): number {
    return this.transactions.length;
  }

  getTotalSpend(): number {
    const total = this.transactions.reduce((acc, tx) => {
      const amount = tx.total;
      return amount < 0 ? acc + Math.abs(amount) : acc;
    }, 0);
    return Number(total.toFixed(2));
  }

  getTotalReceived(): number {
    const total = this.transactions.reduce((acc, tx) => {
      const amount = tx.total;
      return amount > 0 ? acc + amount : acc;
    }, 0);
    return Number(total.toFixed(2));
  }

  getYearlyBudgets(): Record<string, { spend: number; received: number }> {
    return this.aggregateBudgets((tx) => `${tx.dateCreated.getFullYear()}`);
  }

  getMonthlyBudgets(): Record<string, { spend: number; received: number }> {
    return this.aggregateBudgets(
      (tx) =>
        `${tx.dateCreated.getFullYear()}-${(tx.dateCreated.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`
    );
  }

  getWeeklyBudgets(): Record<string, { spend: number; received: number }> {
    return this.aggregateBudgets((tx) => {
      const year = tx.dateCreated.getFullYear();
      const week = getISOWeek(tx.dateCreated);
      return `${year}-W${week.toString().padStart(2, "0")}`;
    });
  }

  getDailyBudgets(): Record<string, { spend: number; received: number }> {
    return this.aggregateBudgets(
      (tx) =>
        `${tx.dateCreated.getFullYear()}-${(tx.dateCreated.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${tx.dateCreated
          .getDate()
          .toString()
          .padStart(2, "0")}`
    );
  }

  getTimeline(): { startDate: string | null; endDate: string | null } {
    if (this.transactions.length === 0) {
      return { startDate: null, endDate: null };
    }

    const dates = this.transactions.map((tx) => tx.dateCreated.getTime());
    const minTimestamp = Math.min(...dates);
    const maxTimestamp = Math.max(...dates);

    return {
      startDate: toLocalDateString(minTimestamp),
      endDate: toLocalDateString(maxTimestamp),
    };
  }

  getReceiverNameOrTitleCategory(): {
    spend: Record<string, number>;
    earned: Record<string, number>;
  } {
    const spendMap: Map<string, number> = new Map();
    const earnedMap: Map<string, number> = new Map();

    // Group transactions by name
    this.transactions.forEach((transaction) => {
      const { sender, receiverNameOrTitle, total } = transaction;
      const absoluteTotal = Math.abs(total);

      const normalizedSender = sender.replace(/\s+/g, "");

      const isBankAccount = /^[A-Z]{2}\d{10,30}$/.test(normalizedSender);

      if (total < 0) {
        spendMap.set(
          receiverNameOrTitle,
          (spendMap.get(receiverNameOrTitle) ?? 0) + absoluteTotal
        );
      } else {
        const key =
          isBankAccount || normalizedSender === ""
            ? receiverNameOrTitle
            : sender;

        earnedMap.set(key, (earnedMap.get(key) ?? 0) + absoluteTotal);
      }
    });

    // Function to merge similar names using Dice Coefficient
    const mergeSimilarNames = (
      map: Map<string, number>
    ): Map<string, number> => {
      const entries = Array.from(map.entries());
      const mergedMap: Map<string, number> = new Map();

      for (let i = 0; i < entries.length; i++) {
        const [key, value] = entries[i];
        let mergedKey = key;

        for (const [existingKey, existingValue] of mergedMap.entries()) {
          if (calculateSimilarityDiceCoefficient(key, existingKey) > 0.7) {
            mergedMap.set(existingKey, existingValue + value);
            mergedKey = existingKey;
            break;
          }
        }

        if (!mergedMap.has(mergedKey)) {
          mergedMap.set(mergedKey, value);
        }
      }

      return mergedMap;
    };

    const mergedSpendMap = mergeSimilarNames(spendMap);
    const mergedEarnedMap = mergeSimilarNames(earnedMap);

    return {
      spend: Object.fromEntries(
        Array.from(mergedSpendMap.entries()).map(([key, value]) => [
          key,
          parseFloat(value.toFixed(2)),
        ])
      ),
      earned: Object.fromEntries(
        Array.from(mergedEarnedMap.entries()).map(([key, value]) => [
          key,
          parseFloat(value.toFixed(2)),
        ])
      ),
    };
  }

  private aggregateBudgets(
    keyGenerator: (tx: TransactionModel) => string
  ): Record<string, { spend: number; received: number }> {
    const budgets = this.transactions.reduce((acc, tx) => {
      const key = keyGenerator(tx);

      if (!acc[key]) {
        acc[key] = { spend: 0, received: 0 };
      }
      if (tx.total < 0) {
        acc[key].spend += Math.abs(tx.total);
      } else {
        acc[key].received += tx.total;
      }
      return acc;
    }, {} as Record<string, { spend: number; received: number }>);

    for (const key in budgets) {
      budgets[key].spend = Number(budgets[key].spend.toFixed(2));
      budgets[key].received = Number(budgets[key].received.toFixed(2));
    }
    return budgets;
  }
}
