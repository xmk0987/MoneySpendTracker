/**
 * Formats a date range into a specific string format.
 *
 * @param startDate - The start date in ISO string format.
 * @param endDate - The end date in ISO string format.
 * @returns A formatted date range string.
 *
 * Example Outputs:
 * - Same month and year: "2-20.12.24"
 * - Different months or years: "30.12.24 - 21.01.25"
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error(
      "Invalid date format. Please provide valid ISO date strings."
    );
  }

  const startDay = start.getDate();
  const startMonth = (start.getMonth() + 1).toString().padStart(2, "0");
  const startYear = (start.getFullYear() % 100).toString().padStart(2, "0");

  const endDay = end.getDate();
  const endMonth = (end.getMonth() + 1).toString().padStart(2, "0");
  const endYear = (end.getFullYear() % 100).toString().padStart(2, "0");

  if (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth()
  ) {
    return `${startDay}-${endDay}.${startMonth}.${startYear}`;
  } else {
    return `${startDay}.${startMonth}.${startYear} - ${endDay}.${endMonth}.${endYear}`;
  }
}

/**
 * Formats a Date object into the format "DD.MM.YY".
 *
 * @param date - The Date object to format.
 * @returns A formatted date string in "DD.MM.YY" format.
 */
export function formatDate(date: Date): string {
  const newDate = new Date(date);
  const day = newDate.getDate().toString().padStart(2, "0");

  const month = (newDate.getMonth() + 1).toString().padStart(2, "0");

  const year = newDate.getFullYear().toString().slice(-2);

  return `${day}.${month}.${year}`;
}

// Helper function to get ISO week number
export function getISOWeek(date: Date): number {
  const tmpDate = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7;
  tmpDate.setDate(tmpDate.getDate() - dayNumber + 3);
  const firstThursday = tmpDate.valueOf();
  tmpDate.setMonth(0, 1);
  if (tmpDate.getDay() !== 4) {
    tmpDate.setMonth(0, 1 + ((4 - tmpDate.getDay() + 7) % 7));
  }
  const weekNumber =
    1 +
    Math.round((firstThursday - tmpDate.valueOf()) / (7 * 24 * 60 * 60 * 1000));
  return weekNumber;
}

export function toLocalDateString(date: string | Date | number | null): string {
  if (!date) return "";
  const d = new Date(date);
  const timezoneOffset = d.getTimezoneOffset() * 60000;
  const localDate = new Date(d.getTime() - timezoneOffset);
  return localDate.toISOString().split("T")[0];
}
