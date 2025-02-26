// app/transactions/TransactionsPage.tsx
"use client";
import React from "react";
import Transactions from "@/components/Transactions/Transactions";
import { useDashboardData } from "@/context/DashboardDataProvider";
import Loader from "@/components/Loader/Loader";

export default function TransactionsPage() {
  const { dashboardData } = useDashboardData();

  if (!dashboardData) return <Loader />;

  return <Transactions data={dashboardData} />;
}
