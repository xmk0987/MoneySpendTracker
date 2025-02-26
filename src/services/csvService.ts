import axios from "axios";
import { DashboardData } from "@/types/types";
import { logErrors } from "@/errors/logErrors";

/**
 * Fetches CSV data for a given ID.
 *
 * @param id - The identifier used to fetch transactions data.
 * @returns A promise resolving to the TransactionsData.
 * @throws An error if the request fails.
 */
export async function getCachedTransactionsData(
  id: string
): Promise<DashboardData> {
  try {
    const response = await axios.get(`/api/csv?id=${encodeURIComponent(id)}`);
    return response.data.data;
  } catch (error) {
    logErrors(error);
    throw new Error("Failed to fetch transactions data");
  }
}

/**
 * Deletes the CSV data associated with a given ID.
 *
 * @param id - The identifier for the CSV data to remove.
 * @returns A promise that resolves once the CSV data is deleted.
 * @throws An error if the deletion fails.
 */
export async function removeCsvData(id: string): Promise<void> {
  try {
    await axios.delete(`/api/csv?id=${encodeURIComponent(id)}`);
  } catch (error) {
    logErrors(error);
    throw new Error("Failed to delete CSV data");
  }
}

/**
 * Processes csv data and returns cached and processed data.
 *
 * @param formData - Csv file and the needed mappings
 * @returns A promise resolving to the TransactionsData.
 * @throws An error if the request fails.
 */
export async function postCsvData(formData: FormData): Promise<DashboardData> {
  try {
    const response = await axios.post("/api/csv", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  } catch (error) {
    logErrors(error);
    throw new Error("Failed to delete CSV data");
  }
}
