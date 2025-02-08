// app/transactions/TransactionsPage.tsx
"use client";

import React from "react";
import { useTransactionsData } from "@/context/TransactionsDataContext";
import Transactions from "@/components/Transactions/Transactions";

export default function TransactionsPage() {
  const { transactionsData } = useTransactionsData();

  return <Transactions data={transactionsData} />;
}
