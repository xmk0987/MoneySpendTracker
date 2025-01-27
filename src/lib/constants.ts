// In ../lib/constants.ts
import { CSVMapping } from "@/models/types";

export const REQUIRED_CSV_FIELDS: (keyof CSVMapping)[] = [
  "date_created",
  "total",
  "sender",
  "payerNameOrTitle",
];

export const CSV_FIELD_LABELS: Record<keyof CSVMapping, string> = {
  date_created: "Date Created",
  total: "Total",
  sender: "Sender",
  payerNameOrTitle: "Payer name or title",
};

export const HEADER_MAPPING: { [key: string]: keyof CSVMapping } = {
  // Finnish Headers
  Kirjauspäivä: "date_created",
  Summa: "total",
  Maksaja: "sender",
  Määrä: "total",

  "Saajan nimi": "payerNameOrTitle",
  Otsikko: "payerNameOrTitle",
  Maksunsaaja: "payerNameOrTitle",

  // English Headers
  "Date Created": "date_created",
  "Creation Date": "date_created",
  "Entry Date": "date_created",

  Total: "total",
  Amount: "total",
  Sum: "total",

  Sender: "sender",
  Payer: "sender",
  "Sender Name": "sender",

  Title: "payerNameOrTitle",
  Description: "payerNameOrTitle",
  Payee: "payerNameOrTitle",
  Recipient: "payerNameOrTitle",
};
