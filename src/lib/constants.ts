// In ../lib/constants.ts
import { CSVMapping } from "@/models/types";

export const REQUIRED_CSV_FIELDS: (keyof CSVMapping)[] = [
  "date_created",
  "total",
  "sender",
  "receiverNameOrTitle",
];

export const CSV_FIELD_LABELS: Record<keyof CSVMapping, string> = {
  date_created: "Date Created",
  total: "Total",
  sender: "Closest to sender name",
  receiverNameOrTitle: "Closest to receiver name",
};

export const HEADER_MAPPING: { [key: string]: (keyof CSVMapping)[] } = {
  // Finnish Headers
  Kirjauspäivä: ["date_created"],
  Summa: ["total"],
  Maksaja: ["sender"],
  Määrä: ["total"],
  "Määrä EUROA": ["total"],
  "Määrä EUR": ["total"],
  Päivämäärä: ["date_created"],

  "Saajan nimi": ["receiverNameOrTitle"],
  Maksunsaaja: ["receiverNameOrTitle"],
  Otsikko: ["receiverNameOrTitle"],
  "Maksaja tai saaja": ["sender", "receiverNameOrTitle"], // Can be sender or receiver
  "Saaja/Maksaja": ["sender", "receiverNameOrTitle"],

  // English Headers
  "Date Created": ["date_created"],
  "Creation Date": ["date_created"],
  "Entry Date": ["date_created"],

  Total: ["total"],
  Amount: ["total"],
  Sum: ["total"],

  Sender: ["sender"],
  Payer: ["sender"],
  "Sender Name": ["sender"],

  Title: ["receiverNameOrTitle"],
  Description: ["receiverNameOrTitle"],
  Payee: ["receiverNameOrTitle"],
  Recipient: ["receiverNameOrTitle"],
};
