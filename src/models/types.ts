import Transaction from "./Transaction";

export interface CSVMapping {
  date_created: string;
  total: string;
  sender: string;
  payerNameOrTitle: string;
}

export interface TransactionsData {
  transactionsDataId: string;
  fileName: string;
  transactions: Transaction[];
  summary: {
    timeline: {
      startDate: string | null;
      endDate: string | null;
    };
    totalCount: number;
    totalSpend: number;
    totalReceived: number;
    budgets: {
      yearlyAggregates: Record<string, { spend: number; received: number }>;
      monthlyAggregates: Record<string, { spend: number; received: number }>;
      dailyAggregates: Record<string, { spend: number; received: number }>;
    };
    categories: {
      payerNameOrTitle: Record<string, number>;
    };
  };
}
