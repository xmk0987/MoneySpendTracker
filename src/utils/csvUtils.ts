/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionProps } from "@/models/Transaction";
import { CSVMapping } from "@/models/types";

// Create the transactions data based on mapping and validate it for null values
export const mapCsvHeadersToTransactions = (
  parsedRows: Record<string, any>[],
  mapping: CSVMapping
) => {
  const transactionsData: TransactionProps[] = parsedRows.map((row) => {
    const mappedRow: any = {};

    for (const internalKey in mapping) {
      const csvHeader = mapping[internalKey as keyof CSVMapping];
      if (csvHeader && row.hasOwnProperty(csvHeader)) {
        mappedRow[internalKey] = row[csvHeader];
      }
    }
    return mappedRow as TransactionProps;
  });

  return transactionsData;
};
