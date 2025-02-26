// app/dashboard/DashboardPage.tsx
"use client";

import React from "react";
import Dashboard from "@/components/Dashboard/Dashboard";
import { useDashboardData } from "@/context/DashboardDataProvider";
import Loader from "@/components/Loader/Loader";

export default function DashboardPage() {
  const { dashboardData } = useDashboardData();

  if (!dashboardData) return <Loader />;

  return <Dashboard data={dashboardData} />;
}
