"use client";
import { useEffect, useState } from "react";
import CsvUpload from "../components/CSVUploader/CSVUploader";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import styles from "./Home.module.css";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedId = localStorage.getItem("transactionsId");
    if (savedId) {
      router.push(`/${savedId}/dashboard`);
    }
  }, [router]);

  if (loading) return <Loader />;

  return (
    <main className={styles.container}>
      <CsvUpload setLoading={setLoading} />
    </main>
  );
}
