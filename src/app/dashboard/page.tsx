"use client";
import { TransactionsData } from "@/models/types";
import React, { useState, useEffect } from "react";
import Loader from "@/components/Loader/Loader";
import Dashboard from "@/components/Dashboard/Dashboard";
import { useRouter, useSearchParams } from "next/navigation";

const DashboardPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");

  const [transactionsData, setTransactionsData] =
    useState<TransactionsData | null>(null);

  useEffect(() => {
    if (id) {
      fetchTransactionsData(id);
    }
  }, [id]);

  // Fetch transactions data if not already fetched
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

  if (!transactionsData) return <Loader />;

  return <Dashboard data={transactionsData} changeCsv={changeFile} />;
};

export default DashboardPage;
