"use client";
import { useEffect, useState } from "react";
import CsvUploadMapper from "../components/CSVUploader/CSVUploader";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import styles from "./Home.module.css";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";
import axios from "axios";

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

  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const code = params.get("code");

      if (code) {
        axios
          .post("/api/spankki/auth/token", { code })
          .then((response) => {
            console.log("Token exchange response:", response.data);
            router.push("/spankki/dashboard");
          })
          .catch((error) => {
            console.error("Error exchanging token:", error);
          });
      }
    }
  }, [router]);

  const handleUploadFromComputer = () => {
    console.log("Upload manually");
  };

  const handleBankAuthorization = () => {
    window.location.href = "/api/spankki/auth";
  };

  return transactionsDataId === "" ? (
    <main className={styles.container}>
      {/*       <CsvUploadMapper setId={setTransactionsDataId} />
       */}
      <h1 className="text-xl text-center">Money Spend Tracker</h1>
      <PrimaryButton
        text="Upload from computer"
        onClick={handleUploadFromComputer}
      />
      <PrimaryButton text="SPankki login" onClick={handleBankAuthorization} />
    </main>
  ) : (
    <Loader />
  );
}
