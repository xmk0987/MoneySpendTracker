// contexts/DashboardDataProvider.tsx
"use client";

import React, { createContext, useContext, useState } from "react";
import { TransactionsData } from "@/types/types";

interface DashboardDataContextValue {
  transactionsData: TransactionsData | null;
  setTransactionsData: (data: TransactionsData | null) => void;
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
  const [transactionsData, setTransactionsData] =
    useState<TransactionsData | null>(null);

  return (
    <DashboardDataContext.Provider
      value={{ transactionsData, setTransactionsData }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
};
