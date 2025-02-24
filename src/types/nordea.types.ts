/**
 * Represents the overall response from the Nordea Accounts API.
 */
export interface NordeaAccountsApiResponse {
  group_header: GroupHeader;
  response: AccountsResponse;
}

/**
 * Contains metadata about the API response.
 */
export interface GroupHeader {
  message_identification: string;
  creation_date_time: string;
  http_code: number;
}

/**
 * Contains the main response with account details and related links.
 */
export interface AccountsResponse {
  accounts: Account[];
  _links: Link[];
}

/**
 * Represents an individual bank account.
 */
export interface Account {
  country: string;
  account_numbers: AccountNumber[];
  currency: string;
  account_name: string;
  product: string;
  account_type: string;
  available_balance: string;
  booked_balance: string;
  value_dated_balance: string;
  bank: Bank;
  status: string;
  credit_limit: string;
  latest_transaction_booking_date: string;
  _links: Link[];
  _id: string;
}

/**
 * Represents an account number with its type.
 */
export interface AccountNumber {
  value: string;
  _type: string;
}

/**
 * Represents bank details.
 */
export interface Bank {
  name: string;
  bic: string;
  country: string;
}

/**
 * Represents a hyperlink related to the account or response.
 */
export interface Link {
  rel: string;
  href: string;
}

/**
 * Represents the complete response from the Nordea transactions API.
 */
export interface NordeaTransactionsApiResponse {
  group_header: GroupHeader;
  response: TransactionsResponse;
}

/**
 * Contains metadata about the API response.
 */
export interface GroupHeader {
  message_identification: string;
  creation_date_time: string;
  message_pagination: MessagePagination;
  http_code: number;
}

/**
 * Contains pagination details.
 */
export interface MessagePagination {
  continuation_key: string;
}

/**
 * Contains the main data payload of the transactions response.
 */
export interface TransactionsResponse {
  transactions: Transaction[];
  account_number: AccountNumber;
  _links: Link[];
}

/**
 * Represents an individual transaction.
 */
export interface Transaction {
  transaction_id: string;
  currency: string;
  booking_date: string;
  value_date: string;
  type_description: string;
  narrative: string;
  message: string;
  status: string;
  reference?: string;
  own_message?: string;
  counterparty_name: string;
  transaction_date: string;
  payment_date: string;
  amount: string;
  card_number?: string;
  original_currency?: string;
  original_currency_amount?: string;
  currency_rate?: string;
}
