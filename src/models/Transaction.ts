// src/models/Transaction.ts
import { parse, isValid } from "date-fns";

export interface TransactionProps {
  date_created: string;
  date_payed: string;
  total: string;
  type_of_transaction: string;
  sender: string;
  receiver: string;
}

export default class Transaction {
  dateCreated: Date;
  datePayed: Date;
  total: number;
  typeOfTransaction: string;
  sender: string;
  receiver: string;
  category?: string;

  constructor({
    date_created,
    date_payed,
    total,
    type_of_transaction,
    sender,
    receiver,
  }: TransactionProps) {
    // Parse and validate dates using the flexible parser.
    const parsedCreated = Transaction.parseDateFlexible(date_created);
    const parsedPayed = Transaction.parseDateFlexible(date_payed);

    if (!parsedCreated || !parsedPayed) {
      throw new Error(
        `Invalid date(s). date_created: ${date_created}, date_payed: ${date_payed}`
      );
    }

    this.dateCreated = parsedCreated;
    this.datePayed = parsedPayed;

    const parsedTotal = Transaction.parseTotal(total);

    if (parsedTotal === null) {
      throw new Error(`Invalid total: ${total}`);
    }

    this.total = parsedTotal;

    this.typeOfTransaction = type_of_transaction;
    this.sender = sender;
    this.receiver = receiver;
  }

  // Factory method that attempts to create a Transaction.
  static tryCreate(props: TransactionProps): Transaction | null {
    try {
      return new Transaction(props);
    } catch (e) {
      console.error("Transaction creation failed:", e);
      return null;
    }
  }

  /**
   * Tries multiple date formats until a valid Date object is produced.
   * @param dateStr - The date string to parse.
   * @returns A valid Date object or null if none of the formats match.
   */
  static parseDateFlexible(dateStr: string): Date | null {
    const formats = [
      "dd-mm-yyyy",
      "dd.MM.yyyy", // e.g. "22.01.2025"
      "yyyy-MM-dd", // e.g. "2025-01-22"
      "MM/dd/yyyy", // e.g. "01/22/2025"
      "dd/MM/yyyy", // e.g. "22/01/2025"
      "MMM dd, yyyy", // e.g. "Jan 22, 2025"
      "dd MMM yyyy", // e.g. "22 Jan 2025"
    ];

    if (!dateStr) {
      return null;
    }

    for (const format of formats) {
      const parsed = parse(dateStr, format, new Date());
      if (isValid(parsed)) {
        return parsed;
      }
    }
    return null;
  }

  /**
   * Attempts to parse a total string with potential non-ASCII minus signs.
   * Returns null if parsing fails.
   */
  static parseTotal(total: string): number | null {
    // Immediately handle empty strings or nullish values
    if (!total) {
      return null;
    }

    const withAsciiMinus = total.replace(/[–—−]/g, "-");

    const sanitized = withAsciiMinus.replace(",", ".").trim();

    const parsed = Number.parseFloat(sanitized);

    if (Number.isNaN(parsed)) {
      return null;
    }

    return Number(parsed.toFixed(2));
  }
}
