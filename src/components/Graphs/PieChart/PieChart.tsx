import React, { useState } from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { TransactionsData } from "@/models/types";
import styles from "../Graph.module.css";
import { getPieChartData, getPieChartOptions } from "./pieChartConfig";
import { capitalizeFirstLetter } from "@/utils/stringSimilarity";

interface PieChartProps {
  data: TransactionsData;
}

Chart.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const [category, setCategory] = useState<"spend" | "earned">("spend");

  // Get data based on the selected category
  const selectedData = data.summary.categories.receiverNameOrTitle[category];

  // Process and sort top 10 transactions
  const sortedData = Object.entries(selectedData)
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
  const pieChartOptions = getPieChartOptions(
    category === "spend" ? "Expenses" : "Earnings"
  );

  return (
    <div className={styles.graphBox}>
      <div className={styles.barHeader}>
        <p>
          Transaction Distribution - Top 10 (
          {category === "spend" ? "Spend" : "Earned"})
        </p>
        <div className={styles.buttonGroup}>
          <button
            key={category}
            onClick={() =>
              setCategory(category === "spend" ? "earned" : "spend")
            }
            className={`${styles.button} `}
          >
            {category === "spend" ? "Show Earned" : "Show Spend"}
          </button>
        </div>
      </div>
      <div className={styles.content}>
        <Pie data={pieChartData} options={pieChartOptions} />
      </div>
    </div>
  );
};

export default PieChart;
