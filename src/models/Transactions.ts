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

  // Sum of all transaction totals.
  getTotalSpend(): number {
    return this.transactions.reduce((acc, tx) => {
      // Assuming negative values represent spending.
      const amount = tx.total;
      return amount < 0 ? acc + Math.abs(amount) : acc;
    }, 0);
  }

  // Sum of all positive (received) transactions.
  getTotalReceived(): number {
    return this.transactions.reduce((acc, tx) => {
      const amount = tx.total;
      return amount > 0 ? acc + amount : acc;
    }, 0);
  }

  // Monthly aggregation example.
  getMonthlyBudgets(): Record<string, { spend: number; received: number }> {
    return this.transactions.reduce((acc, tx) => {
      // Use the transaction date (e.g., dateCreated) and group by YYYY-MM.
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
  }
}
