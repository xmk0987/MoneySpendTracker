/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/csvProcessor.ts
import fs from "fs";
import * as Papa from "papaparse";
import Transaction from "@/models/Transaction";
import Transactions from "@/models/Transactions";
import type { CSVMapping } from "@/models/csv";
import { createTransactionsData } from "../lib/csvUtils";

export interface CsvData {
  transactions: Transaction[];
  summary: {
    totalCount: number;
    totalSpend: number;
    totalReceived: number;
    monthlyAggregates: Record<string, { spend: number; received: number }>;
  };
}

/**
 * Process a CSV file given its file path and a mapping.
 * Returns a promise that resolves with the processed transactions
 * and an aggregation summary.
 */
export function processCsvFile(
  filePath: string,
  mapping: CSVMapping
): Promise<CsvData> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (readErr, data) => {
      if (readErr) {
        return reject(readErr);
      }

      Papa.parse<Record<string, any>>(data, {
        header: true,
        complete: (results) => {
          const parsedRows = results.data;

          // Remap the CSV rows to our internal TransactionProps
          const transactionsData = createTransactionsData(parsedRows, mapping);

          const transactions = transactionsData
            .map((props) => Transaction.tryCreate(props))
            .filter((tx): tx is Transaction => tx !== null);

          const transactionsCollection = new Transactions(transactions);
          const summary = {
            totalCount: transactionsCollection.countTotal(),
            totalSpend: transactionsCollection.getTotalSpend(),
            totalReceived: transactionsCollection.getTotalReceived(),
            monthlyAggregates: transactionsCollection.getMonthlyBudgets(),
          };

          resolve({ transactions, summary });
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  });
}
