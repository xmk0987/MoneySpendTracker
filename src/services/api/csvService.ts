import axios from "axios";
import { TransactionsData } from "@/models/types";
import { logErrors } from "@/errors/logErrors";

/**
 * Fetches CSV data for a given ID.
 *
 * @param id - The identifier used to fetch transactions data.
 * @returns A promise resolving to the TransactionsData.
 * @throws An error if the request fails.
 */
export async function getCsvData(id: string): Promise<TransactionsData> {
  try {
    const response = await axios.get(`/api/csv?id=${encodeURIComponent(id)}`);
    // Axios throws for non-2xx responses, so if we reach here we got a successful response.
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
