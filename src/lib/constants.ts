// In ../lib/constants.ts
import { CSVMapping } from "@/models/types";

export const REQUIRED_CSV_FIELDS: (keyof CSVMapping)[] = [
  "date_created",
  "date_payed",
  "total",
  "type_of_transaction",
  "sender",
  "receiver",
];

export const CSV_FIELD_LABELS: Record<keyof CSVMapping, string> = {
  date_created: "Date Created",
  date_payed: "Date Payed",
  total: "Total",
  type_of_transaction: "Type of Transaction",
  sender: "Sender",
  receiver: "Receiver",
};
