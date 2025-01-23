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
  transactions: Transaction[];
  summary: {
    totalCount: number;
    totalSpend: number;
    totalReceived: number;
    monthlyAggregates: Record<string, { spend: number; received: number }>;
  };
}

export interface CsvData extends TransactionsData {
  transactionsDataId: string;
}
