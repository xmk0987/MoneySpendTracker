import React from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { TransactionsData } from "@/models/types";
import styles from "../Graph.module.css";
import { getPieChartData, getPieChartOptions } from "./pieChartConfig";
import { capitalizeFirstLetter } from "@/utils/helperFunctions";

interface PieChartProps {
  data: TransactionsData;
}

Chart.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const sortedData = Object.entries(data.summary.categories.payerNameOrTitle)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const labels = sortedData.map(([key]) => capitalizeFirstLetter(key));
  const values = sortedData.map(([, value]) => value);
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#D68EFF",
    "#5BCFFF",
    "#FF6F61",
    "#7DCE13",
  ];

  const pieChartData = getPieChartData(labels, values, colors);
  const pieChartOptions = getPieChartOptions("expenses");

  return (
    <div className={styles.graphBox}>
      <div className={styles.barHeader}>
        <p>Transaction Distribution - Top 10</p>
      </div>
      <div className={styles.content}>
        <Pie data={pieChartData} options={pieChartOptions} />
      </div>
    </div>
  );
};

export default PieChart;
