// src/models/Transactions.ts
import { normalizePayerTitle } from "@/utils/helperFunctions";
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
      startDate: new Date(minTimestamp).toISOString(),
      endDate: new Date(maxTimestamp).toISOString(),
    };
  }

  /**
   * Groups transactions by payerNameOrTitle and sums the total amount per payerNameOrTitle.
   * Sorts the payerNameOrTitles in descending order based on the total amount.
   * @returns A Record where the key is the payerNameOrTitle's name (capitalized) and the value is the total amount.
   */
  getPayerNameOrTitleCategory(): Record<string, number> {
    const groupedMap: Map<string, number> = new Map();

    this.transactions.forEach((transaction) => {
      const payerNameOrTitle = normalizePayerTitle(
        transaction.payerNameOrTitle
      );

      const currentTotal = groupedMap.get(payerNameOrTitle) ?? 0;

      groupedMap.set(
        payerNameOrTitle,
        currentTotal + Math.abs(transaction.total)
      );
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
