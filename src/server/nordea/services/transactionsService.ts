import {
  NordeaAccount,
  NordeaTransactionsApiResponse,
  NordeaAccountsApiResponse,
  NordeaTransactionWithAccountName,
} from "@/types/nordea.types";
import { createNordeaApi } from "@/server/nordea/config/nordeaAxiosInstance";
import { TransactionsData } from "@/types/types";
import TransactionModel from "@/models/TransactionModel";
import { createDashboardData } from "@/server/dashboard/dashboardData";

export const getNordeaAccounts = async (): Promise<NordeaAccount[]> => {
  const accountsEndpoint = "/personal/v5/accounts";
  const nordeaApi = await createNordeaApi(accountsEndpoint);

  const accountsResponse = await nordeaApi.get<NordeaAccountsApiResponse>(
    "/v5/accounts"
  );
  return accountsResponse.data.response.accounts;
};

export const getNordeaTransactions = async (
  accounts: NordeaAccount[]
): Promise<NordeaTransactionWithAccountName[]> => {
  const accountsWithTransactions = accounts.filter((account: NordeaAccount) =>
    account._links.some((link) => link.rel === "transactions")
  );

  // Set date to get the current max in sandbox of 2 months of transactions
  const now = new Date();
  const toDate = now.toISOString().split("T")[0];

  const twoMonthsAgo = new Date(now);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  const fromDate = twoMonthsAgo.toISOString().split("T")[0];

  const transactionsNested = await Promise.all(
    accountsWithTransactions.map(async (account: NordeaAccount) => {
      const transactionsLink = account._links.find(
        (link) => link.rel === "transactions"
      )!.href;

      const accountName = account.account_name;

      const queryParams = new URLSearchParams({
        from_date: fromDate,
        to_date: toDate,
      });

      const transactionsUrl = `${transactionsLink}?${queryParams.toString()}`;

      const transactionsApi = await createNordeaApi(
        `/personal${transactionsUrl}`
      );

      try {
        const transactionResponse =
          await transactionsApi.get<NordeaTransactionsApiResponse>(
            transactionsUrl
          );
        return transactionResponse.data.response.transactions.map(
          (transaction) => ({
            ...transaction,
            accountName,
          })
        );
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

export const mapNordeaTransactionsToModel = async (
  transactionsData: NordeaTransactionWithAccountName[]
): Promise<TransactionsData> => {
  const transactions: TransactionModel[] = transactionsData
    .map((transaction: NordeaTransactionWithAccountName) => {
      const total = transaction.amount;
      const date_created = transaction.payment_date;
      let sender = "";
      let receiverNameOrTitle = "";
      if (parseFloat(total) < 0) {
        receiverNameOrTitle =
          transaction.counterparty_name || "Unknown Receiver";
        sender = transaction.accountName || "Unknown Sender";
      } else {
        sender = transaction.counterparty_name || "Unknown Sender";
        receiverNameOrTitle = transaction.accountName || "Unknown Receiver";
      }

      return TransactionModel.tryCreate({
        date_created,
        total,
        sender,
        receiverNameOrTitle,
      });
    })
    .filter(
      (transaction): transaction is TransactionModel => transaction !== null
    );

  const dashboardData = await createDashboardData(transactions, "nordea");

  return dashboardData;
};
