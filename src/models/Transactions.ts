// src/models/Transactions.ts
import { calculateSimilarityDiceCoefficient } from "@/utils/stringSimilarity";
import Transaction from "./Transaction";
import { getISOWeek, toLocalDateString } from "@/utils/dates";

export default class Transactions {
  private transactions: Transaction[];

  constructor(transactions: Transaction[]) {
    this.transactions = transactions;
  }

  // Count the number of transactions.
  countTotal(): number {
    return this.transactions.length;
  }

  // Sum of all spending transactions (negative values).
  getTotalSpend(): number {
    const total = this.transactions.reduce((acc, tx) => {
      const amount = tx.total;
      return amount < 0 ? acc + Math.abs(amount) : acc;
    }, 0);
    return Number(total.toFixed(2));
  }

  // Sum of all received (positive) transactions.
  getTotalReceived(): number {
    const total = this.transactions.reduce((acc, tx) => {
      const amount = tx.total;
      return amount > 0 ? acc + amount : acc;
    }, 0);
    return Number(total.toFixed(2));
  }

  // Yearly Aggregation based on dateCreated
  getYearlyBudgets(): Record<string, { spend: number; received: number }> {
    return this.aggregateBudgets((tx) => `${tx.dateCreated.getFullYear()}`);
  }

  // Monthly Aggregation based on dateCreated
  getMonthlyBudgets(): Record<string, { spend: number; received: number }> {
    return this.aggregateBudgets(
      (tx) =>
        `${tx.dateCreated.getFullYear()}-${(tx.dateCreated.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`
    );
  }

  // Weekly Aggregation based on dateCreated
  getWeeklyBudgets(): Record<string, { spend: number; received: number }> {
    return this.aggregateBudgets((tx) => {
      const year = tx.dateCreated.getFullYear();
      const week = getISOWeek(tx.dateCreated);
      return `${year}-W${week.toString().padStart(2, "0")}`;
    });
  }

  // Daily Aggregation based on dateCreated
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
  /**
   * Groups transactions by receiverNameOrTitle, normalizes names, and merges similar ones using the Dice Coefficient.
   * Separates the transactions into 'spend' and 'earned' categories.
   * @returns An object containing separate records for spend and earned transactions.
   */
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

      // Normalize sender by removing spaces
      const normalizedSender = sender.replace(/\s+/g, "");

      // Check if sender is a bank account number (IBAN-like)
      const isBankAccount = /^[A-Z]{2}\d{10,30}$/.test(normalizedSender);

      if (total < 0) {
        // Categorize as spending
        spendMap.set(
          receiverNameOrTitle,
          (spendMap.get(receiverNameOrTitle) ?? 0) + absoluteTotal
        );
      } else {
        // Categorize as earned
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
    keyGenerator: (tx: Transaction) => string
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

    // Round each aggregated value to two decimals.
    for (const key in budgets) {
      budgets[key].spend = Number(budgets[key].spend.toFixed(2));
      budgets[key].received = Number(budgets[key].received.toFixed(2));
    }
    return budgets;
  }
}
