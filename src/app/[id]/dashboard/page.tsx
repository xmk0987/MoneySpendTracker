// app/id/dashboard/DashboardPage.tsx
"use client";

import React from "react";
import Dashboard from "@/components/Dashboard/Dashboard";
import { useDashboardData } from "@/context/DashboardDataProvider";
import Loader from "@/components/Loader/Loader";

export default function DashboardPage() {
  const { transactionsData } = useDashboardData();

  if (!transactionsData) return <Loader />;

  return <Dashboard data={transactionsData} />;
}
