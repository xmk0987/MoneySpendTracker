"use client";
import { TransactionsData } from "@/models/types";
import React from "react";
import styles from "./Dashboard.module.css";
import InfoBox from "@/components/InfoBox/InfoBox";
import { formatDateRange } from "@/utils/dates";
import BarGraph from "@/components/Graphs/BarGraph/BarGraph";
import PieChart from "@/components/Graphs/PieChart/PieChart";

interface DashboardProps {
  data: TransactionsData;
  changeCsv: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, changeCsv }) => {
  const profit = Number(
    data.summary.totalReceived - data.summary.totalSpend
  ).toFixed(2);

  const date = formatDateRange(
    data.summary.timeline.startDate!,
    data.summary.timeline.endDate!
  );

  return (
    <div className={styles["dashboardContainer"]}>
      <div className={styles["header"]}>
        <h2 className="truncate">Dashboard</h2>
        <div className={styles["headerOptions"]}>
          <div className={`text-sm ${styles["currentFile"]}`}>
            <p>{data.fileName}</p>
            <button onClick={() => changeCsv(data.transactionsDataId)}>
              X
            </button>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default Dashboard;
