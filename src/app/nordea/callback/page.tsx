// app/nordea/callback/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";
import { getNordeaTransactions } from "@/services/api/nordeaService";

export default function NordeaCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      /**
       * TODO Handle oauth here before fetching dashboard data
       * Currently not possilbe with nordea api
       */
      try {
        const dashboardData = await getNordeaTransactions();
        router.push(`/${dashboardData.id}/dashboard`);
      } catch (error) {
        console.error("Error exchanging token:", error);
        router.push("/");
      }
    };

    handleOAuthCallback();
  }, [router]);

  return <Loader />;
}
