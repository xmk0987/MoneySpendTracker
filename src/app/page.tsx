"use client";
import { useEffect, useState } from "react";
import CsvUploadMapper from "../components/CSVUploader/CSVUploader";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";

export default function Home() {
  const router = useRouter();
  const [transactionsDataId, setTransactionsDataId] = useState("");

  // Initialize the ID from local storage if present
  useEffect(() => {
    const savedId = localStorage.getItem("transactionsId");
    if (savedId) {
      setTransactionsDataId(savedId);
      router.push(`/${savedId}/dashboard`);
    }
  }, [router]);

  return transactionsDataId === "" ? (
    <CsvUploadMapper setId={setTransactionsDataId} />
  ) : (
    <Loader />
  );
}
