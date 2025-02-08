// app/dashboard/DashboardContent.jsx
"use client";

import React from "react";
import Dashboard from "@/components/Dashboard/Dashboard";
import { useTransactionsData } from "@/context/TransactionsDataContext";

/**
 * DashboardContent handles data fetching and rendering for the dashboard.
 * It uses the useSearchParams hook to extract URL parameters and fetches data accordingly.
 * All logic that depends on asynchronous client hooks is encapsulated here.
 */
export default function DashboardPage() {
  const { transactionsData, changeFile } = useTransactionsData();

  return <Dashboard data={transactionsData} changeCsv={changeFile} />;
}
