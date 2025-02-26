import TransactionModel from "../models/TransactionModel";

export interface RequiredHeaders {
  date_created: string;
  total: string;
  sender: string;
  receiverNameOrTitle: string;
}

export interface DashboardData {
  id: string;
  fileName: string;
  transactions: TransactionModel[];
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
      receiverNameOrTitle: {
        spend: Record<string, number>;
        earned: Record<string, number>;
      };
    };
  };
}
