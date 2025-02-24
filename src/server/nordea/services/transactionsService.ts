import {
  Account,
  NordeaTransactionsApiResponse,
  NordeaAccountsApiResponse,
  Transaction,
} from "@/types/nordea.types";
import { createNordeaApi } from "@/server/nordea/config/nordeaAxiosInstance";

export const getNordeaAccounts = async (): Promise<Account[]> => {
  const accountsEndpoint = "/personal/v5/accounts";
  const nordeaApi = await createNordeaApi(accountsEndpoint);

  const accountsResponse = await nordeaApi.get<NordeaAccountsApiResponse>(
    "/v5/accounts"
  );
  return accountsResponse.data.response.accounts;
};

export const getNordeaTransactions = async (
  accounts: Account[]
): Promise<Transaction[]> => {
  const accountsWithTransactions = accounts.filter((account) =>
    account._links.some((link) => link.rel === "transactions")
  );

  const transactionsNested = await Promise.all(
    accountsWithTransactions.map(async (account) => {
      const transactionsLink = account._links.find(
        (link) => link.rel === "transactions"
      )!.href;

      const transactionsApi = await createNordeaApi(
        `/personal${transactionsLink}`
      );

      try {
        const transactionResponse =
          await transactionsApi.get<NordeaTransactionsApiResponse>(
            transactionsLink
          );
        return transactionResponse.data.response.transactions;
      } catch (error) {
        console.error(
          `Error fetching transactions for account ${account._id}:`,
          error
        );
        throw error;
      }
    })
  );

  return transactionsNested.flat();
};
