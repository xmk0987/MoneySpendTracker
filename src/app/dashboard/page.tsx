"use client";
import { TransactionsData } from "@/models/types";
import React from "react";
import styles from "./Dashboard.module.css";

interface DashboardProps {
  data: TransactionsData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  return (
    <div className={styles["dashboardContainer"]}>
    </div>
  );
};

export default Dashboard;
