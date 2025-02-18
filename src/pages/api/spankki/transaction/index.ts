import type { NextApiRequest, NextApiResponse } from "next";
import { logErrors } from "@/errors/logErrors";
import { createSpankkiApi } from "@/server/axiosConfig/spankki/spankkiAxiosInstance";
import { mapTransactionsToFitModel } from "@/server/services/spankki/transactionService";
import {
  SpankkiAccount,
  SpankkiAccountApiResponse,
  SpankkiTransactionApiResponse,
} from "@/types/spankki/spankki.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const spankkiApi = await createSpankkiApi(req, res);
    const accountResponse = await spankkiApi.get<SpankkiAccountApiResponse>(
      "accounts"
    );
    const accounts: SpankkiAccount[] = accountResponse.data.Data.Account;

    if (!accounts || accounts.length === 0) {
      return res.status(200).json({ message: "No accounts found" });
    }

    const transactionsArrayNested = await Promise.all(
      accounts.map(async (account: SpankkiAccount) => {
        try {
          const transactionResponse =
            await spankkiApi.get<SpankkiTransactionApiResponse>(
              `accounts/${account.AccountId}/transactions`
            );
          return transactionResponse.data.Data.Transaction;
        } catch (err) {
          console.error(
            "Error fetching transactions for account",
            account.AccountId,
            err
          );
          throw err;
        }
      })
    );

    const transactionsArray = transactionsArrayNested.flat();

    const dashboardData = await mapTransactionsToFitModel(transactionsArray);

    return res.status(201).json({
      message: "Spankki transactions processed successfully",
      data: dashboardData,
    });
  } catch (error) {
    logErrors(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
