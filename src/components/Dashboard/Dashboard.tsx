"use client";
import { DashboardData } from "@/types/types";
import React from "react";
import styles from "./Dashboard.module.css";
import InfoBox from "@/components/InfoBox/InfoBox";
import { formatDateRange } from "@/utils/dates";
import BarGraph from "@/components/Graphs/BarGraph/BarGraph";
import PieChart from "@/components/Graphs/PieChart/PieChart";

interface DashboardProps {
  data: DashboardData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const profit = Number(
    data.summary.totalReceived - data.summary.totalSpend
  ).toFixed(2);

  const date = formatDateRange(
    data.summary.timeline.startDate!,
    data.summary.timeline.endDate!
  );

  return (
    <>
      <div className={styles["info"]}>
        <InfoBox header="Total transactions" value={data.summary.totalCount} />
        <InfoBox header="Earned" value={data.summary.totalReceived} />
        <InfoBox header="Spend" value={data.summary.totalSpend} />
        <InfoBox header="Profit" value={profit} />
        <InfoBox header="Timeline" value={date ?? "Invalid timeline"} />
      </div>
      <div className={styles["graphs"]}>
        <div className={styles["spendEarnGraph"]}>
          <BarGraph data={data} />
        </div>
        <div className={styles["categoryGraph"]}>
          <PieChart data={data} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
