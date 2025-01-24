"use client";

import { useCallback, useEffect, useState } from "react";
import CsvUploadMapper from "../components/CSVUploader/CSVUploader";
import { TransactionsData } from "@/models/types";

export default function Home() {
  const [transactionsDataId, setTransactionsDataId] = useState("");
  const [transactionsData, setTransactionsData] =
    useState<TransactionsData | null>(null);

  const getTransactionsData = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/csv?id=${encodeURIComponent(id)}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions data");
      }

      const data = await response.json();
      console.log("Transactions Data:", data.data);
      setTransactionsData(data.data);
    } catch (error) {
      console.error("Error fetching transactions data:", error);
      setTransactionsDataId("");
      setTransactionsData(null);
      localStorage.removeItem("transactionsId");
    }
  }, []);

  useEffect(() => {
    if (transactionsDataId !== "") {
      getTransactionsData(transactionsDataId);
    } else {
      setTransactionsDataId("");
      setTransactionsData(null);
    }
  }, [getTransactionsData, transactionsDataId]);

  useEffect(() => {
    const savedId = localStorage.getItem("transactionsId");
    if (savedId) {
      setTransactionsDataId(savedId);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {transactionsDataId === "" && !transactionsData ? (
        <CsvUploadMapper />
      ) : (
        <p>{transactionsDataId}</p>
      )}
    </div>
  );
}
