// contexts/TransactionsDataContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import { TransactionsData } from "@/models/types";

interface TransactionsDataContextValue {
  transactionsData: TransactionsData;
  removeFile: () => Promise<void>;
}

const TransactionsDataContext = createContext<
  TransactionsDataContextValue | undefined
>(undefined);

export const useTransactionsData = () => {
  const context = useContext(TransactionsDataContext);
  if (!context) {
    throw new Error(
      "useTransactionsData must be used within a TransactionsDataProvider"
    );
  }
  return context;
};

export const TransactionsDataProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [transactionsData, setTransactionsData] =
    useState<TransactionsData | null>(null);

  // Fetch the data when the id changes
  useEffect(() => {
    if (id) {
      fetchTransactionsData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const resetData = () => {
    localStorage.removeItem("transactionsId");
    setTransactionsData(null);
    router.push("/");
  };

  const fetchTransactionsData = async (id: string) => {
    try {
      const response = await fetch(`/api/csv?id=${encodeURIComponent(id)}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch transactions data");
      }
      const data = await response.json();
      setTransactionsData(data.data);
    } catch (error) {
      console.error("Error fetching transactions data:", error);
      resetData();
    }
  };

  const removeFile = async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/csv?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete CSV data");
      }
      resetData();
    } catch (error) {
      console.error("Error removing CSV data", error);
    }
  };

  // While the data is not yet fetched, display the Loader
  if (!transactionsData) return <Loader />;

  return (
    <TransactionsDataContext.Provider value={{ transactionsData, removeFile }}>
      {children}
    </TransactionsDataContext.Provider>
  );
};
