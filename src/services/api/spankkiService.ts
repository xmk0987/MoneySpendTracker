import axios from "axios";
import { logErrors } from "@/errors/logErrors";
import { TransactionsData } from "@/types/types";

/**
 * Fetches and modifies spankki transactions data to fit the dashboard
 *
 * @returns A promise resolving to dashboard data.
 * @throws An error if the request fails.
 */
export async function getSpankkiTransactions(): Promise<TransactionsData> {
  try {
    const response = await axios.post(`/api/spankki/transaction`);

    return response.data.data;
  } catch (error) {
    logErrors(error);
    throw new Error("Failed to fetch transactions data");
  }
}
