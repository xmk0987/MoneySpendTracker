// app/spankki/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import { getSpankkiTransactions } from "@/services/api/spankkiService";

export default function SpankkiCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const code = params.get("code");

        if (code) {
          try {
            // Exchange the code for a token.
            await axios.post("/api/spankki/auth/token", { code });
            // Fetch the new transactions data ID and setup spankki transactions.
            const dashboardData = await getSpankkiTransactions();
            router.push(`/${dashboardData.id}/dashboard`);
          } catch (error) {
            console.error("Error exchanging token:", error);
            router.push("/");
          }
        }
      }
    };

    handleOAuthCallback();
  }, [router]);

  return <Loader />;
}
