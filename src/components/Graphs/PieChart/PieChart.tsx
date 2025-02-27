import React, { useState, useEffect } from "react";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { DashboardData } from "@/types/types";
import styles from "../Graph.module.css";
import { getPieChartData, getPieChartOptions } from "./pieChartConfig";
import { capitalizeFirstLetter } from "@/utils/stringSimilarity";

interface PieChartProps {
  data: DashboardData;
}

Chart.register(ArcElement, Tooltip, Legend);

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const [category, setCategory] = useState<"spend" | "earned">("spend");
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [legendPosition, setLegendPosition] = useState<"bottom" | "right">(
    "bottom"
  );

  const updateLegendPosition = () => {
    const width = window.innerWidth;
    if (width <= 1100 && width >= 600) {
      setLegendPosition("right");
    } else {
      setLegendPosition("bottom");
    }
  };

  // Set the legend position initially and add a resize listener
  useEffect(() => {
    updateLegendPosition();
    window.addEventListener("resize", updateLegendPosition);
    return () => window.removeEventListener("resize", updateLegendPosition);
  }, []);

  // Get data based on the selected category
  const selectedData = data.summary.categories.receiverNameOrTitle[category];

  const toggleLegend = () => {
    setShowLegend(!showLegend);
  };

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
    category === "spend" ? "Expenses" : "Earnings",
    showLegend,
    legendPosition
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
          <button onClick={toggleLegend}>
            {!showLegend ? "Show" : "Hide"} legend
          </button>
        </div>
      </div>
      <div className={`${styles.content}`}>
        <div className={styles.piechart}>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
      </div>
    </div>
  );
};

export default PieChart;
