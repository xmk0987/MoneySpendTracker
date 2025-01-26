// Function to generate the necessary data arrays
export const generateDailyData = (
  dailyAggregates: Record<
    string,
    Record<string, { spend: number; received: number }>
  >
) => {
  const aggregates = dailyAggregates;

  // Extract and sort the dates
  const labels = Object.keys(aggregates).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Map the spend and received values based on the sorted dates
  const spendPoints = labels.map((date) => aggregates[date].spend);
  const receivedPoints = labels.map((date) => aggregates[date].received);

  return { labels, spendPoints, receivedPoints };
};
