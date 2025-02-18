// app/transactions/TransactionsPage.tsx
"use client";
import Loader from "@/components/Loader/Loader";
import React from "react";
import Transactions from "@/components/Transactions/Transactions";
import { useDashboardData } from "@/context/DashboardDataProvider";

export default function TransactionsPage() {
  const { transactionsData } = useDashboardData();

  if (!transactionsData) return <Loader />;

  return <Transactions data={transactionsData} />;
}
