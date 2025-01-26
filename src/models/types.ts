import Transaction from "./Transaction";

export interface CSVMapping {
  date_created: string;
  date_payed: string;
  total: string;
  type_of_transaction: string;
  sender: string;
  receiver: string;
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
      yearlyType: Record<
        string,
        Record<string, { spend: number; received: number }>
      >;
      monthlyType: Record<
        string,
        Record<string, { spend: number; received: number }>
      >;
    };
  };
}
