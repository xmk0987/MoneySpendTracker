// contexts/TransactionsDataContext.tsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import { TransactionsData } from "@/models/types";
import { getCsvData, removeCsvData } from "@/services/api/csvService";
import { getSpankkiTransactions } from "@/services/api/spankkiService";

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

  const resetData = () => {
    localStorage.removeItem("transactionsId");
    setTransactionsData(null);
    router.push("/");
  };

  const fetchTransactionsData = async (id: string) => {
    try {
      const data = await getCsvData(id);
      setTransactionsData(data);
    } catch (error) {
      console.error("Error fetching transactions data:", error);
      resetData();
    }
  };

  const removeFile = async () => {
    if (!id) return;
    try {
      await removeCsvData(id);
      resetData();
    } catch (error) {
      console.error("Error removing CSV data:", error);
    }
  };

  // Fetch the data when the id changes
  useEffect(() => {
    if (id && id !== "spankki") {
      fetchTransactionsData(id);
    } else if (id && id === "spankki") {
      (async () => {
        const newId = await getSpankkiTransactions();
        router.push(`/${newId}/dashboard`);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!transactionsData) return <Loader />;

  return (
    <TransactionsDataContext.Provider value={{ transactionsData, removeFile }}>
      {children}
    </TransactionsDataContext.Provider>
  );
};
