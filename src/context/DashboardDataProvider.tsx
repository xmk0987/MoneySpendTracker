// contexts/DashboardDataProvider.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import { DashboardData } from "@/types/types";

interface DashboardDataContextValue {
  dashboardData: DashboardData | null;
  setDashboardData: (data: DashboardData | null) => void;
}

const DashboardDataContext = createContext<
  DashboardDataContextValue | undefined
>(undefined);

export const useDashboardData = () => {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error(
      "useDashboardData must be used within a DashboardDataProvider"
    );
  }
  return context;
};

export const DashboardDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );

  return (
    <DashboardDataContext.Provider value={{ dashboardData, setDashboardData }}>
      {children}
    </DashboardDataContext.Provider>
  );
};
