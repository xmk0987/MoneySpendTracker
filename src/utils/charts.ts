export const generateDailyData = (
  dailyAggregates: Record<
    string,
    Record<string, { spend: number; received: number }>
  >
) => {
  const aggregates = dailyAggregates;

  const labels = Object.keys(aggregates).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const spendPoints = labels.map((date) => aggregates[date].spend);
  const receivedPoints = labels.map((date) => aggregates[date].received);

  return { labels, spendPoints, receivedPoints };
};
