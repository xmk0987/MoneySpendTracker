import { capitalizeFirstLetter } from "@/utils/stringSimilarity";
import { ChartOptions, ChartData } from "chart.js";

// Define the structure for the datasets
interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

// Function to generate chart data
export const getChartData = (
  labels: string[],
  spendPoints: number[],
  receivedPoints: number[]
): ChartData<"bar", number[], string> => {
  const datasets: ChartDataset[] = [
    {
      label: "Spend",
      data: spendPoints,
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Received",
      data: receivedPoints,
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ];

  return {
    labels,
    datasets,
  };
};

export const getChartOptions = (currentType: string): ChartOptions<"bar"> => ({
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: `Transactions (${capitalizeFirstLetter(currentType)})`,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += `€${context.parsed.y.toFixed(2)}`;
          }
          return label;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return `€${value}`;
        },
      },
    },
  },
});
