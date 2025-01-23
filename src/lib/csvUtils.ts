/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionProps } from "@/models/Transaction";
import { CSVMapping } from "@/models/types";
import Transaction from "@/models/Transaction";

// Create the transactions data based on mapping and validate it for null values
export const createTransactionsData = (
  parsedRows: Record<string, any>[],
  mapping: CSVMapping
) => {
  const transactionsData: TransactionProps[] = parsedRows.map((row) => {
    const mappedRow: any = {};

    for (const internalKey in mapping) {
      const csvHeader = mapping[internalKey as keyof CSVMapping];
      // Only map if the CSV row has that header
      if (csvHeader && row.hasOwnProperty(csvHeader)) {
        mappedRow[internalKey] = row[csvHeader];
      }
    }
    return mappedRow as TransactionProps;
  });

  return validateTransactionData(transactionsData);
};

// Validate transactions data for null values
const validateTransactionData = (transactionsData: TransactionProps[]) => {
  return transactionsData.filter((props) => {
    // Check that date_created produces a valid date.
    const validDatePayed = Transaction.parseDateFlexible(props.date_payed);
    const validDateCreated = Transaction.parseDateFlexible(props.date_created);
    // Check that total can be converted to a number
    const validTotal = Transaction.parseTotal(props.total);
    const validSender = props.sender && props.sender.trim() !== "";
    const validReceiver = props.receiver && props.receiver.trim() !== "";

    return (
      validDatePayed !== null &&
      validDateCreated !== null &&
      validTotal !== null &&
      validSender &&
      validReceiver
    );
  });
};
