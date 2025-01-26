// src/models/Transactions.ts
import Transaction from "./Transaction";

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
      const week = this.getISOWeek(tx.datePayed);
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

  // Yearly Budgets Grouped by Type
  getYearlyBudgetsByType(): Record<
    string,
    Record<string, { spend: number; received: number }>
  > {
    return this.transactions.reduce((acc, tx) => {
      const year = tx.datePayed.getFullYear();
      const type = tx.typeOfTransaction;
      const key = `${year}`;

      if (!acc[key]) {
        acc[key] = {};
      }

      if (!acc[key][type]) {
        acc[key][type] = { spend: 0, received: 0 };
      }

      if (tx.total < 0) {
        acc[key][type].spend += Math.abs(tx.total);
      } else {
        acc[key][type].received += tx.total;
      }

      return acc;
    }, {} as Record<string, Record<string, { spend: number; received: number }>>);
  }

  // Monthly Budgets Grouped by Type
  getMonthlyBudgetsByType(): Record<
    string,
    Record<string, { spend: number; received: number }>
  > {
    return this.transactions.reduce((acc, tx) => {
      const date = tx.datePayed;
      const month = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      const type = tx.typeOfTransaction;

      if (!acc[month]) {
        acc[month] = {};
      }

      if (!acc[month][type]) {
        acc[month][type] = { spend: 0, received: 0 };
      }

      if (tx.total < 0) {
        acc[month][type].spend += Math.abs(tx.total);
      } else {
        acc[month][type].received += tx.total;
      }

      return acc;
    }, {} as Record<string, Record<string, { spend: number; received: number }>>);
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

  // Helper function to get ISO week number
  private getISOWeek(date: Date): number {
    const tmpDate = new Date(date.valueOf());
    const dayNumber = (date.getDay() + 6) % 7; // Monday=0, Sunday=6
    tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
    const firstThursday = tmpDate.valueOf();
    tmpDate.setMonth(0, 1);
    if (tmpDate.getDay() !== 4) {
      tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7));
    }
    const weekNumber =
      1 +
      Math.round(
        (firstThursday - tmpDate.valueOf()) / (7 * 24 * 60 * 60 * 1000)
      );
    return weekNumber;
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
