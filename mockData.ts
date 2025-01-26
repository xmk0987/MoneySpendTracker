export const validTransaction = {
  date_created: "22.01.2025",
  date_payed: "21.01.2025",
  total: "-9,15",
  type_of_transaction: "KORTTIOSTO",
  sender: "ONNI VITIKAINEN",
  receiver: "GROCERY STORE",
};

export const mockTransactions = [
  {
    date_created: "22.01.2025",
    date_payed: "21.01.2025",
    total: "-15,00",
    type_of_transaction: "KORTTIOSTO",
    sender: "ONNI VITIKAINEN",
    receiver: "GROCERY STORE",
  },
  {
    date_created: "19.01.2025",
    date_payed: "19.01.2025",
    total: "100,50",
    type_of_transaction: "VERKKOMAKSU",
    sender: "ONNI VITIKAINEN",
    receiver: "ONLINE MARKETPLACE",
  },
  {
    date_created: "18.01.2025",
    date_payed: "18.01.2025",
    total: "-25,30",
    type_of_transaction: "KORTTIOSTO",
    sender: "ONNI VITIKAINEN",
    receiver: "RESTAURANT",
  },
];

export const mockTransactionsWithErrors = [
  {
    date_created: "22-01-2025", // Invalid format
    date_payed: "21.01.2025",
    total: "-9.15", // Invalid decimal separator
    type_of_transaction: "KORTTIOSTO",
    sender: "ONNI VITIKAINEN",
    receiver: "SHOP NAME",
  },
  {
    date_created: "23.01.2025",
    date_payed: null, // Missing date
    total: "-20,00",
    type_of_transaction: "KORTTIOSTO",
    sender: "ONNI VITIKAINEN",
    receiver: "UNKNOWN STORE",
  },
  {
    date_created: "20.01.2025",
    date_payed: "20.01.2025",
    total: null, // Missing total
    type_of_transaction: "VERKKOMAKSU",
    sender: "ONNI VITIKAINEN",
    receiver: "ELECTRONICS STORE",
  },
];

export const invalidDateCreated = {
  date_created: "sss02-2025", // Invalid date
  date_payed: "21.01.2025",
  total: "-9,15",
  type_of_transaction: "KORTTIOSTO",
  sender: "ONNI VITIKAINEN",
  receiver: "SHOP NAME",
};

export const invalidDatePayed = {
  date_created: "22.01.2025",
  date_payed: "30-0ds2025", // Invalid date
  total: "-9,15",
  type_of_transaction: "KORTTIOSTO",
  sender: "ONNI VITIKAINEN",
  receiver: "SHOP NAME",
};

export const invalidTotal = {
  date_created: "22.01.2025",
  date_payed: "21.01.2025",
  total: "INVALID", // Non-numeric total
  type_of_transaction: "KORTTIOSTO",
  sender: "ONNI VITIKAINEN",
  receiver: "SHOP NAME",
};
