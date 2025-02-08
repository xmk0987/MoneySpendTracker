// app/dashboard/page.jsx
"use client";

import React, { Suspense } from "react";
import Loader from "@/components/Loader/Loader";
import DashboardContent from "./DashboardContent";

/**
 * DashboardPage serves as the page entry point.
 * It wraps the DashboardContent component in a Suspense boundary
 * so that any asynchronous operations (e.g., useSearchParams) are handled gracefully.
 */
export default function DashboardPage() {
  return (
    <Suspense fallback={<Loader />}>
      <DashboardContent />
    </Suspense>
  );
}
