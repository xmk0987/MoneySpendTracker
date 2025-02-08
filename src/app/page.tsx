"use client";
import { useEffect, useState } from "react";
import CsvUploadMapper from "../components/CSVUploader/CSVUploader";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [, setTransactionsDataId] = useState("");

  // Initialize the ID from local storage if present
  useEffect(() => {
    const savedId = localStorage.getItem("transactionsId");
    if (savedId) {
      setTransactionsDataId(savedId);
      router.push(`/dashboard?id=${savedId}`);
    }
  }, [router]);

  return <CsvUploadMapper setId={setTransactionsDataId} />;
}
