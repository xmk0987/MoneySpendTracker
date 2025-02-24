"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Home.module.css";
import PrimaryButton from "@/components/PrimaryButton/PrimaryButton";

export default function Home() {
  const router = useRouter();

  // Initialize the ID from local storage if present
  useEffect(() => {
    const savedId = localStorage.getItem("transactionsId");
    if (savedId) {
      router.push(`/${savedId}/dashboard`);
    }
  }, [router]);

  const handleUploadFromComputer = () => {
    router.push(`/csv`);
  };

  const handleSpankkiAuthorization = () => {
    window.location.href = "/api/spankki/auth";
  };

  const handleNordeaAuthorization = async () => {
    // ! Only available in production with nordea need to simulate being
    // ! authorized
    /* window.location.href = "/api/nordea/auth"; */
    router.push("/nordea/callback");
  };

  return (
    <main className={styles.container}>
      <h1 className="text-xl text-center">Money Spend Tracker</h1>
      <PrimaryButton
        text="Upload from computer"
        onClick={handleUploadFromComputer}
      />
      <PrimaryButton
        text="SPankki login"
        onClick={handleSpankkiAuthorization}
      />
      <PrimaryButton text="Nordea login" onClick={handleNordeaAuthorization} />
    </main>
  );
}
