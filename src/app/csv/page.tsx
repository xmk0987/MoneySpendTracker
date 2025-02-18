"use client";
import { useState } from "react";
import styles from "./Csv.module.css";
import CsvUploadMapper from "@/components/CSVUploader/CSVUploader";
import Loader from "@/components/Loader/Loader";

export default function Csv() {
  const [loading, setLoading] = useState<boolean>(false);

  if (loading) return <Loader />;

  return (
    <main className={styles.container}>
      <CsvUploadMapper setLoading={setLoading} />
    </main>
  );
}
