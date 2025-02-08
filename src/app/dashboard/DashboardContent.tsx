// app/dashboard/DashboardContent.jsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import Dashboard from "@/components/Dashboard/Dashboard";
import { TransactionsData } from "@/models/types";

/**
 * DashboardContent handles data fetching and rendering for the dashboard.
 * It uses the useSearchParams hook to extract URL parameters and fetches data accordingly.
 * All logic that depends on asynchronous client hooks is encapsulated here.
 */
export default function DashboardContent() {
  // Retrieve the search parameters from the URL
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams?.get("id");

  const [transactionsData, setTransactionsData] =
    useState<TransactionsData | null>(null);

  useEffect(() => {
    if (id) {
      fetchTransactionsData(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /**
   * Fetches transactions data from the server using the provided id.
   * If data is already fetched, it does nothing.
   * On failure, it logs the error and navigates back to the home page.
   * @param {string} id - The id from the search parameters.
   */
  const fetchTransactionsData = async (id: string) => {
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
      setTransactionsData(null);
      router.push("/");
    }
  };

  /**
   * Deletes the CSV data on the server, clears the local state,
   * and navigates back to the home page.
   */
  const changeFile = async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/csv?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete csv data");
      }
      setTransactionsData(null);
      localStorage.removeItem("transactionsId");
      router.push("/");
    } catch (error) {
      console.error("Error removing csv", error);
    }
  };

  // While transactions data is not yet fetched, show the Loader
  if (!transactionsData) return <Loader />;

  // Once data is available, render the Dashboard component
  return <Dashboard data={transactionsData} changeCsv={changeFile} />;
}
