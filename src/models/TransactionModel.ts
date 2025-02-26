// src/models/Transaction.ts
import { parse, isValid } from "date-fns";

export interface TransactionModelProps {
  date_created: string;
  total: string;
  sender: string;
  receiverNameOrTitle: string;
}

export default class TransactionModel {
  dateCreated: Date;
  total: number;
  sender: string;
  receiverNameOrTitle: string;

  constructor({
    date_created,
    total,
    sender,
    receiverNameOrTitle,
  }: TransactionModelProps) {
    const parsedCreated = TransactionModel.parseDateFlexible(date_created);

    if (!parsedCreated) {
      console.log("Parsed", parsedCreated, date_created);

      throw new Error(`Invalid date(s). date_created: ${date_created}`);
    }

    this.dateCreated = parsedCreated;

    const parsedTotal = TransactionModel.parseTotal(total);

    if (parsedTotal === null) {
      throw new Error(`Invalid total: ${total}`);
    }

    this.total = parsedTotal;
    this.sender = sender;
    this.receiverNameOrTitle = receiverNameOrTitle;
  }

  static tryCreate(props: TransactionModelProps): TransactionModel | null {
    try {
      return new TransactionModel(props);
    } catch (e) {
      console.error("Transaction creation failed:", e);
      return null;
    }
  }

  static parseDateFlexible(dateStr: string): Date | null {
    const formats = [
      "dd-MM-yyyy", // e.g. "22-01-2025"
      "dd.MM.yyyy", // e.g. "22.01.2025"
      "yyyy-MM-dd", // e.g. "2025-01-22"
      "MM/dd/yyyy", // e.g. "01/22/2025"
      "dd/MM/yyyy", // e.g. "22/01/2025"
      "MMM dd, yyyy", // e.g. "Jan 22, 2025"
      "dd MMM yyyy", // e.g. "22 Jan 2025"
      "yyyy/MM/dd", // e.g. "2025/01/05"
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

  static parseTotal(total: string): number | null {
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
