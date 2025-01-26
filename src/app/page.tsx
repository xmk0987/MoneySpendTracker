"use client";

import { useCallback, useEffect, useState } from "react";
import CsvUploadMapper from "../components/CSVUploader/CSVUploader";
import { TransactionsData } from "@/models/types";
import Dashboard from "./dashboard/page";

export default function Home() {
  const [transactionsDataId, setTransactionsDataId] = useState("");
  const [transactionsData, setTransactionsData] =
    useState<TransactionsData | null>(null);

  // Get transactions data for dashboard if its not fetched
  // If the id is not valid will empty states and ask for new upload
  const getTransactionsData = useCallback(
    async (id: string) => {
      if (transactionsData) return;

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
        setTransactionsDataId("");
        setTransactionsData(null);
        localStorage.removeItem("transactionsId");
      }
    },
    [transactionsData]
  );

  // Fetch the data when an id is present if no id reset states
  useEffect(() => {
    if (transactionsDataId !== "") {
      getTransactionsData(transactionsDataId);
    } else {
      setTransactionsDataId("");
      setTransactionsData(null);
    }
  }, [getTransactionsData, transactionsDataId]);

  // Initialize the id from localstorage if present
  useEffect(() => {
    const savedId = localStorage.getItem("transactionsId");
    if (savedId) {
      setTransactionsDataId(savedId);
    }
  }, []);

  const changeFile = async (id: string) => {
    try {
      const response = await fetch(`/api/csv?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete csv data");
      }

      setTransactionsData(null);
      setTransactionsDataId("");
      localStorage.removeItem("transactionsId");
    } catch (error) {
      console.error("Error removing csv", error);
    }
  };

  return (
    <main className="mainContainer">
      {transactionsData ? (
        <Dashboard data={transactionsData} changeCsv={changeFile} />
      ) : transactionsDataId === "" ? (
        <div className="centerContainer">
          <CsvUploadMapper
            setId={setTransactionsDataId}
            setData={setTransactionsData}
          />
        </div>
      ) : (
        <div className="centerContainer">
          <p>Loading...</p>
        </div>
      )}
    </main>
  );
}
