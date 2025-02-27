import { capitalizeFirstLetter } from "@/utils/stringSimilarity";
import { ChartOptions, ChartData } from "chart.js";

// Define the structure for the dataset
interface PieChartDataset {
  label: string;
  data: number[];
  backgroundColor: string[];
}

// Function to generate Pie Chart data
export const getPieChartData = (
  labels: string[],
  dataPoints: number[],
  colors: string[]
): ChartData<"pie", number[], string> => {
  const datasets: PieChartDataset[] = [
    {
      label: "Categories",
      data: dataPoints,
      backgroundColor: colors,
    },
  ];

  return {
    labels,
    datasets,
  };
};

// Function to generate Pie Chart options
export const getPieChartOptions = (
  currentType: string,
  showLegend: boolean,
  legendPosition: "bottom" | "right"
): ChartOptions<"pie"> => ({
  responsive: true,
  plugins: {
    legend: {
      display: showLegend,
      position: legendPosition,
      labels: {
        padding: 20,
      },
    },
    title: {
      display: false,
      text: `Transaction Distribution (${capitalizeFirstLetter(currentType)})`,
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          let label = context.label || "";
          if (label) {
            label += ": ";
          }
          if (context.raw !== null) {
            label += `€${Number(context.raw).toFixed(2)}`;
          }
          return label;
        },
      },
    },
  },
});
