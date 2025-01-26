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

export const HEADER_MAPPING: { [key: string]: keyof CSVMapping } = {
  // Finnish Headers
  Kirjauspäivä: "date_created",
  Maksupäivä: "date_payed",
  Summa: "total",
  Tapahtumalaji: "type_of_transaction",
  Maksaja: "sender",
  "Saajan nimi": "receiver",

  // English Headers
  "Date Created": "date_created",
  "Creation Date": "date_created",
  "Entry Date": "date_created",

  "Payment Date": "date_payed",
  "Date Paid": "date_payed",
  "Pay Date": "date_payed",

  Total: "total",
  Amount: "total",
  Sum: "total",

  "Transaction Type": "type_of_transaction",
  "Type of Transaction": "type_of_transaction",
  "Transaction Category": "type_of_transaction",

  Sender: "sender",
  Payer: "sender",
  "Sender Name": "sender",

  Receiver: "receiver",
  Payee: "receiver",
  Recipient: "receiver",
};
