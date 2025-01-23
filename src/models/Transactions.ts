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

  // Group transactions by year-month (based on dateCreated)
  // and compute monthly aggregates with values rounded to 2 decimals.
  getMonthlyBudgets(): Record<string, { spend: number; received: number }> {
    const budgets = this.transactions.reduce((acc, tx) => {
      // Group by the year and month of dateCreated.
      const date = tx.dateCreated;
      const key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;

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

    // Round each monthly aggregated value to two decimals.
    for (const key in budgets) {
      budgets[key].spend = Number(budgets[key].spend.toFixed(2));
      budgets[key].received = Number(budgets[key].received.toFixed(2));
    }
    return budgets;
  }
}
