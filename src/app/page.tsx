"use client";
import { useEffect, useState } from "react";
import CsvUploadMapper from "../components/CSVUploader/CSVUploader";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import styles from "./Home.module.css";

export default function Home() {
  const router = useRouter();
  const [transactionsDataId, setTransactionsDataId] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize the ID from local storage if present
  useEffect(() => {
    const savedId = localStorage.getItem("transactionsId");
    if (savedId) {
      setTransactionsDataId(savedId);
      router.push(`/${savedId}/dashboard`);
    }
  }, [router]);

  if (loading || transactionsDataId !== "") return <Loader />;

  return (
    <main className={styles.container}>
      <CsvUploadMapper setId={setTransactionsDataId} setLoading={setLoading} />
    </main>
  );
}
