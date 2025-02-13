"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/csvProcessor.ts
import fs from "fs";
import * as Papa from "papaparse";
import Transaction from "@/models/Transaction";
import Transactions from "@/models/Transactions";
import type { CSVMapping } from "@/models/types";
import { createTransactionsData } from "../utils/csvUtils";
import client from "@/lib/redisDb";

/**
 * Process a CSV file given its file path and a mapping.
 * Returns a promise that resolves with the processed transactions
 * and an aggregation summary.
 */
export async function processCsvFile(
  filePath: string,
  mapping: CSVMapping,
  fileName: string
): Promise<{ transactionsDataId: string }> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (readErr, data) => {
      if (readErr) {
        return reject(readErr);
      }

      Papa.parse<Record<string, any>>(data, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
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
            budgets: {
              yearlyAggregates: transactionsCollection.getYearlyBudgets(),
              monthlyAggregates: transactionsCollection.getMonthlyBudgets(),
              dailyAggregates: transactionsCollection.getDailyBudgets(),
            },
            categories: {
              receiverNameOrTitle:
                transactionsCollection.getReceiverNameOrTitleCategory(),
            },
            timeline: transactionsCollection.getTimeline(),
          };

          const transactionsDataId = crypto.randomUUID();

          await client.hSet(transactionsDataId, {
            transactions: JSON.stringify(transactions),
            summary: JSON.stringify(summary),
            fileName: fileName,
          });

          await client.expire(transactionsDataId, 7200);

          resolve({ transactionsDataId });
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  });
}
