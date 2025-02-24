import axios from "axios";
import { logErrors } from "@/errors/logErrors";
import { TransactionsData } from "@/types/types";

/**
 * Fetches and modifies nordea transactions data to fit the dashboard
 *
 * @returns A promise resolving to dashboard data.
 * @throws An error if the request fails.
 */
export async function getNordeaTransactions(): Promise<TransactionsData> {
  try {
    console.log("Go fetch data");

    const response = await axios.post(`/api/nordea/transaction`);

    console.log("Data received", response.data);
    return response.data.data;
  } catch (error) {
    logErrors(error);
    throw new Error("Failed to fetch transactions data");
  }
}
