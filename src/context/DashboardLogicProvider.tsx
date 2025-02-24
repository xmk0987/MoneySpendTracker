// contexts/DashboardLogicContext.tsx
"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import {
  getCachedTransactionsData,
  removeCsvData,
} from "@/services/api/csvService";
import { useDashboardData } from "./DashboardDataProvider";

interface DashboardLogicContextValue {
  removeFile: () => Promise<void>;
}

const DashboardLogicContext = createContext<
  DashboardLogicContextValue | undefined
>(undefined);

export const useDashboardLogic = () => {
  const context = useContext(DashboardLogicContext);
  if (!context) {
    throw new Error(
      "useDashboardLogic must be used within a DashboardLogicProvider"
    );
  }
  return context;
};

interface DashboardLogicProviderProps {
  children: React.ReactNode;
}

export const DashboardLogicProvider: React.FC<DashboardLogicProviderProps> = ({
  children,
}) => {
  const { transactionsData, setTransactionsData } = useDashboardData();
  const { id } = useParams() as { id: string | undefined };
  const router = useRouter();

  const resetData = useCallback(() => {
    router.push("/");
    localStorage.removeItem("transactionsId");
    setTransactionsData(null);
  }, [router, setTransactionsData]);

  const fetchTransactionsData = useCallback(
    async (id: string) => {
      try {
        const data = await getCachedTransactionsData(id);
        setTransactionsData(data);
      } catch (error) {
        console.error("Error fetching transactions data:", error);
        resetData();
      }
    },
    [resetData, setTransactionsData]
  );

  const removeFile = async () => {
    if (!id) return;
    try {
      await removeCsvData(id);
      resetData();
    } catch (error) {
      console.error("Error removing CSV data:", error);
    }
  };

  useEffect(() => {
    if (id && !transactionsData) {
      fetchTransactionsData(id);
    }
  }, [fetchTransactionsData, id, transactionsData]);

  if (!id || !transactionsData) return <Loader />;

  return (
    <DashboardLogicContext.Provider value={{ removeFile }}>
      {children}
    </DashboardLogicContext.Provider>
  );
};
