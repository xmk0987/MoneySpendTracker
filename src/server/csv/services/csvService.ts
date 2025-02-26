"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/csvProcessor.ts
import fs from "fs";
import * as Papa from "papaparse";
import TransactionModel from "@/models/TransactionModel";
import { TransactionModelProps } from "@/models/TransactionModel";
import { DashboardData, RequiredHeaders } from "@/types/types";
import { createDashboardData } from "@/server/dashboard/dashboardData";

/**
 * Process a CSV file given its file path and a mapping.
 * Returns a promise that resolves with the processed transactions
 * and an aggregation summary.
 */
export async function processCsvFile(
  filePath: string,
  mapping: RequiredHeaders,
  fileName: string
): Promise<DashboardData> {
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

          const transactionsData = mapCsvHeadersToTransactions(
            parsedRows,
            mapping
          );

          const transactions = transactionsData
            .map((props) => TransactionModel.tryCreate(props))
            .filter((tx): tx is TransactionModel => tx !== null);

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

// Create the transactions data based on mapping and validate it for null values
export const mapCsvHeadersToTransactions = (
  parsedRows: Record<string, any>[],
  mapping: RequiredHeaders
) => {
  const transactionsData: TransactionModelProps[] = parsedRows.map((row) => {
    const mappedRow: any = {};

    for (const internalKey in mapping) {
      const csvHeader = mapping[internalKey as keyof RequiredHeaders];
      if (csvHeader && row.hasOwnProperty(csvHeader)) {
        mappedRow[internalKey] = row[csvHeader];
      }
    }
    return mappedRow as TransactionModelProps;
  });

  return transactionsData;
};
