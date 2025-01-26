// src/models/Transactions.ts
import { normalizeReceiver } from "@/utils/helperFunctions";
import Transaction from "./Transaction";
import { getISOWeek } from "@/utils/dates";

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

  // Yearly Aggregation based on datePayed
  getYearlyBudgets(): Record<string, { spend: number; received: number }> {
    return this.aggregateBudgets((tx) => `${tx.datePayed.getFullYear()}`);
  }

  // Monthly Aggregation based on datePayed
  getMonthlyBudgets(): Record<string, { spend: number; received: number }> {
    return this.aggregateBudgets(
      (tx) =>
        `${tx.datePayed.getFullYear()}-${(tx.datePayed.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`
    );
  }

  // Weekly Aggregation based on datePayed
  getWeeklyBudgets(): Record<string, { spend: number; received: number }> {
    return this.aggregateBudgets((tx) => {
      const year = tx.datePayed.getFullYear();
      const week = getISOWeek(tx.datePayed);
      return `${year}-W${week.toString().padStart(2, "0")}`;
    });
  }

  // Daily Aggregation based on datePayed
  getDailyBudgets(): Record<string, { spend: number; received: number }> {
    return this.aggregateBudgets(
      (tx) =>
        `${tx.datePayed.getFullYear()}-${(tx.datePayed.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${tx.datePayed
          .getDate()
          .toString()
          .padStart(2, "0")}`
    );
  }

  getTimeline(): { startDate: string | null; endDate: string | null } {
    if (this.transactions.length === 0) {
      return { startDate: null, endDate: null };
    }

    const dates = this.transactions.map((tx) => tx.datePayed.getTime());
    const minTimestamp = Math.min(...dates);
    const maxTimestamp = Math.max(...dates);

    return {
      startDate: new Date(minTimestamp).toISOString(),
      endDate: new Date(maxTimestamp).toISOString(),
    };
  }

  /**
   * Groups transactions by receiver and sums the total amount per receiver.
   * Sorts the receivers in descending order based on the total amount.
   * @returns A Record where the key is the receiver's name (capitalized) and the value is the total amount.
   */
  getReceiverCategory(): Record<string, number> {
    const groupedMap: Map<string, number> = new Map();

    this.transactions.forEach((transaction) => {
      const receiver = normalizeReceiver(transaction.receiver);

      const currentTotal = groupedMap.get(receiver) ?? 0;

      groupedMap.set(receiver, currentTotal + Math.abs(transaction.total));
    });

    const groupedData = Object.fromEntries(
      Array.from(groupedMap.entries()).map(([key, value]) => [
        key,
        parseFloat(value.toFixed(2)),
      ])
    );

    return groupedData;
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
