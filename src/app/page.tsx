"use client";
import { useEffect, useState } from "react";
import CsvUpload from "../components/CSVUploader/CSVUploader";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import styles from "./Home.module.css";
import { useDashboardData } from "@/context/DashboardDataProvider";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { dashboardData } = useDashboardData();

  useEffect(() => {
    const savedId = localStorage.getItem("transactionsId");
    if (savedId) {
      router.push(`/${savedId}/dashboard`);
    }
  }, [router]);

  if (loading || dashboardData) return <Loader />;

  return (
    <div className="mainContainer">
      <main className={styles.container}>
        <CsvUpload setLoading={setLoading} />
      </main>
    </div>
  );
}
