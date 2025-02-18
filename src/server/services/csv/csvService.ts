"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import * as Papa from "papaparse";
import Transaction from "@/models/Transaction";
import type { CSVMapping, TransactionsData } from "@/types/types";
import { mapCsvHeadersToTransactions } from "../../../utils/csvUtils";
import { createDashboardData } from "../transactions/transactionsService";

/**
 * Process a CSV file given its file path and a mapping.
 * Returns a promise that resolves with the processed transactions
 * and an aggregation summary.
 */
export async function processCsvFile(
  filePath: string,
  mapping: CSVMapping,
  fileName: string
): Promise<TransactionsData> {
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
          const transactionsData = mapCsvHeadersToTransactions(
            parsedRows,
            mapping
          );

          const transactions = transactionsData
            .map((props) => Transaction.tryCreate(props))
            .filter((tx): tx is Transaction => tx !== null);

          const dashboardData = await createDashboardData(
            transactions,
            fileName
          );

          resolve(dashboardData);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  });
}
