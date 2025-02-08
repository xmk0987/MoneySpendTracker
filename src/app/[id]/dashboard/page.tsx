// app/dashboard/DashboardPage.tsx
"use client";

import React from "react";
import Dashboard from "@/components/Dashboard/Dashboard";
import { useTransactionsData } from "@/context/TransactionsDataContext";

export default function DashboardPage() {
  const { transactionsData } = useTransactionsData();

  return <Dashboard data={transactionsData} />;
}
