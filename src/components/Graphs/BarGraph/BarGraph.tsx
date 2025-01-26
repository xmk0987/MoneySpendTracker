// src/components/BarGraph/BarGraph.tsx

import React, { useMemo, useState } from "react";
import styles from "../Graph.module.css";
import { TransactionsData } from "@/models/types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getChartData, getChartOptions } from "./barGraphConfig";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarGraphProps {
  data: TransactionsData;
}

const BarGraph: React.FC<BarGraphProps> = ({ data }) => {
  const graphDataTypes = ["daily", "monthly", "yearly"];

  const monthlyKeys = Object.keys(
    data.summary.budgets.monthlyAggregates
  ).length;
  const [currentType, setCurrentType] = useState<string>(
    monthlyKeys > 5 ? "monthly" : "daily"
  );

  const generateGraphData = () => {
    let aggregates: { [key: string]: { spend: number; received: number } };
    let labelFormatter: (key: string) => string;

    switch (currentType) {
      case "daily":
        aggregates = data.summary.budgets.dailyAggregates || {};
        labelFormatter = (date) => {
          const d = new Date(date);
          return d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
        };
        break;
      case "monthly":
        aggregates = data.summary.budgets.monthlyAggregates || {};
        labelFormatter = (month) => {
          const [year, mon] = month.split("-");
          const date = new Date(parseInt(year), parseInt(mon) - 1);
          return date.toLocaleString("default", {
            month: "short",
            year: "numeric",
          });
        };
        break;
      case "yearly":
        aggregates = data.summary.budgets.yearlyAggregates || {};
        labelFormatter = (year) => {
          return year;
        };
        break;
      default:
        aggregates = data.summary.budgets.dailyAggregates || {};
        labelFormatter = (key) => key;
    }

    const sortedKeys = Object.keys(aggregates).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const labels = sortedKeys.map(labelFormatter);

    const spendPoints = sortedKeys.map((key) => aggregates[key].spend);
    const receivedPoints = sortedKeys.map((key) => aggregates[key].received);

    return { labels, spendPoints, receivedPoints };
  };

  const { labels, spendPoints, receivedPoints } = useMemo(generateGraphData, [
    data,
    currentType,
  ]);

  const chartData = useMemo(
    () => getChartData(labels, spendPoints, receivedPoints),
    [labels, spendPoints, receivedPoints]
  );

  const chartOptions = useMemo(
    () => getChartOptions(currentType),
    [currentType]
  );

  return (
    <div className={styles.graphBox}>
      <div className={styles.barHeader}>
        <p>Transactions</p>
        <div className={styles.buttonGroup}>
          {graphDataTypes.map((type) => (
            <button
              key={type}
              onClick={() => setCurrentType(type)}
              className={`${styles.button} ${
                currentType === type ? styles.activeButton : ""
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.content}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BarGraph;
