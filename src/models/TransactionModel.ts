import { parse, isValid } from "date-fns";

export interface TransactionModelProps {
  date_created: string;
  total: string;
  sender: string;
  receiverNameOrTitle: string;
}
/**
 * Single Transaction used in the app dashboard and transactions.
 */
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

  /**
   * Encapsulated error handling when creating a TransactionModel to easily handle
   * bad values.
   * @param props - TransactionModelProps to create the TransactionModel with
   * @returns TransactionModel object or null
   */
  static tryCreate(props: TransactionModelProps): TransactionModel | null {
    try {
      return new TransactionModel(props);
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
    if (!dateStr) {
      return null;
    }

    const isoParsed = new Date(dateStr);
    if (isValid(isoParsed)) {
      return isoParsed;
    }

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
