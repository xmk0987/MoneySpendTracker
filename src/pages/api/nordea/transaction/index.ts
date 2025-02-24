import type { NextApiRequest, NextApiResponse } from "next";
import { logErrors } from "@/errors/logErrors";
import {
  getNordeaAccounts,
  getNordeaTransactions,
} from "@/server/nordea/services/transactionsService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const accounts = await getNordeaAccounts();

    if (!accounts || accounts.length === 0) {
      return res.status(200).json({ message: "No accounts found" });
    }

    const nordeaTransactions = await getNordeaTransactions(accounts);

    return res.status(200).json({ nordeaTransactions });
  } catch (error) {
    logErrors(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
