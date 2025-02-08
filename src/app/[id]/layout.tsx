// app/[id]/layout.tsx
"use client";

import React from "react";
import styles from "./layout.module.css";
import { TransactionsDataProvider } from "@/context/TransactionsDataContext";
import Header from "@/components/Header/Header";

interface IdLayoutProps {
  children: React.ReactNode;
}

/**
 * IdLayout provides a common layout for all pages under a specific user ID.
 */
const IdLayout: React.FC<IdLayoutProps> = ({ children }) => {
  return (
    <TransactionsDataProvider>
      <Header />
      <main className={styles.content}>
        <div className={styles.innerContainer}>{children}</div>
      </main>
    </TransactionsDataProvider>
  );
};

export default IdLayout;
