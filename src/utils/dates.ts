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
  // Parse the input date strings into Date objects
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Validate the parsed dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error(
      "Invalid date format. Please provide valid ISO date strings."
    );
  }

  // Extract day, month, and last two digits of the year for start date
  const startDay = start.getDate(); // No leading zero
  const startMonth = (start.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const startYear = (start.getFullYear() % 100).toString().padStart(2, "0"); // Last two digits

  // Extract day, month, and last two digits of the year for end date
  const endDay = end.getDate(); // No leading zero
  const endMonth = (end.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const endYear = (end.getFullYear() % 100).toString().padStart(2, "0"); // Last two digits

  // Check if both dates are in the same month and year
  if (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth()
  ) {
    // Format: "2-20.12.24"
    return `${startDay}-${endDay}.${startMonth}.${startYear}`;
  } else {
    // Format: "30.12.24 - 21.01.25"
    return `${startDay}.${startMonth}.${startYear} - ${endDay}.${endMonth}.${endYear}`;
  }
}
