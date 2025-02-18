// app/[id]/layout.tsx
"use client";

import React from "react";
import styles from "./layout.module.css";
import Header from "@/components/Header/Header";
import { DashboardLogicProvider } from "@/context/DashboardLogicProvider";

interface IdLayoutProps {
  children: React.ReactNode;
}

/**
 * IdLayout provides a common layout for all pages under a specific user ID.
 */
const IdLayout: React.FC<IdLayoutProps> = ({ children }) => {
  return (
    <DashboardLogicProvider>
      <Header />
      <main className={styles.content}>
        <div className={styles.innerContainer}>{children}</div>
      </main>
    </DashboardLogicProvider>
  );
};

export default IdLayout;
