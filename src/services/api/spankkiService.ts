import axios from "axios";
import { logErrors } from "@/errors/logErrors";

/**
 * Fetches CSV data for a given ID.
 *
 * @param id - The identifier used to fetch transactions data.
 * @returns A promise resolving to the string.
 * @throws An error if the request fails.
 */
export async function getSpankkiTransactions(): Promise<string> {
  try {
    const response = await axios.post(`/api/spankki/transaction`);

    return response.data.data.transactionsDataId;
  } catch (error) {
    logErrors(error);
    throw new Error("Failed to fetch transactions data");
  }
}
