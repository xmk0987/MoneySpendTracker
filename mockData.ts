export const validTransaction = {
  date_created: "22.01.2025",
  total: "-9,15",
  sender: "ONNI VITIKAINEN",
  receiverNameOrTitle: "GROCERY STORE",
};

export const mockTransactions = [
  {
    date_created: "22.01.2025",
    total: "-15,00",
    sender: "ONNI VITIKAINEN",
    receiverNameOrTitle: "GROCERY STORE",
  },
  {
    date_created: "19.01.2025",
    total: "100,50",
    sender: "ONNI VITIKAINEN",
    receiverNameOrTitle: "ONLINE MARKETPLACE",
  },
  {
    date_created: "18.01.2025",
    total: "-25,30",
    sender: "ONNI VITIKAINEN",
    receiverNameOrTitle: "RESTAURANT",
  },
];

export const mockTransactionsWithErrors = [
  {
    date_created: "22-01-2025", // Invalid format
    total: "-9.15", // Invalid decimal separator
    sender: "ONNI VITIKAINEN",
    receiverNameOrTitle: "SHOP NAME",
  },
  {
    date_created: null,
    total: "-20,00",
    sender: "ONNI VITIKAINEN",
    receiverNameOrTitle: "UNKNOWN STORE",
  },
  {
    date_created: "20.01.2025",
    total: null, // Missing total
    sender: "ONNI VITIKAINEN",
    receiverNameOrTitle: "ELECTRONICS STORE",
  },
];

export const invalidDateCreated = {
  date_created: "sss02-2025",
  total: "-9,15",
  sender: "ONNI VITIKAINEN",
  receiverNameOrTitle: "SHOP NAME",
};

export const invalidTotal = {
  date_created: "22.01.2025",
  total: "INVALID", // Non-numeric total
  sender: "ONNI VITIKAINEN",
  receiverNameOrTitle: "SHOP NAME",
};
