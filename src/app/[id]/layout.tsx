// app/[id]/layout.tsx
"use client";

import React from "react";
import { TransactionsDataProvider } from "@/context/TransactionsDataContext";

interface IdLayoutProps {
  children: React.ReactNode;
}

/**
 * IdLayout provides a common layout for all pages under a specific user ID.
 */
const IdLayout: React.FC<IdLayoutProps> = ({ children }) => {
  return <TransactionsDataProvider>{children}</TransactionsDataProvider>;
};

export default IdLayout;
