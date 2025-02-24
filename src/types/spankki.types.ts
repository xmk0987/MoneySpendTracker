export interface SpankkiTransactionApiResponse {
  Data: {
    Transaction: SpankkiTransaction[];
  };
  Links: {
    Self: string;
    First: string;
    Prev: string;
    Next: string;
    Last: string;
  };
  Meta: {
    TotalPages: number;
    FirstAvailableDateTime: string;
    LastAvailableDateTime: string;
  };
}

export interface SpankkiTransaction {
  AccountId: string;
  TransactionId: string;
  TransactionReference: string;
  StatementReference: string[];
  CreditDebitIndicator: "Credit" | "Debit";
  Status: string;
  TransactionMutability: string;
  BookingDateTime: string;
  ValueDateTime: string;
  AcceptanceDateTime: string;
  TransactionInformation: string;
  AddressLine: string;
  Amount: { Amount: string; Currency: string };
  ChargeAmount: { Amount: string; Currency: string };
  CurrencyExchange: {
    SourceCurrency: string;
    TargetCurrency: string;
    UnitCurrency: string;
    ExchangeRate: number;
    ContractIdentification: string;
    QuotationDate: string;
    InstructedAmount: { Amount: string; Currency: string };
  };
  BankTransactionCode: { Code: string; SubCode: string };
  ProprietaryBankTransactionCode: { Code: string; Issuer: string };
  Balance: {
    CreditDebitIndicator: string;
    Type: string;
    Amount: { Amount: string; Currency: string };
  };
  MerchantDetails: { MerchantName: string; MerchantCategoryCode: string };
  CreditorAgent: {
    SchemeName: string;
    Identification: string;
    Name: string;
    PostalAddress: {
      AddressType: string;
      Department: string;
      SubDepartment: string;
      StreetName: string;
      BuildingNumber: string;
      PostCode: string;
      TownName: string;
      CountrySubDivision: string;
      Country: string;
      AddressLine: string[];
    };
  };
  CreditorAccount: {
    SchemeName: string;
    Identification: string;
    Name: string;
    SecondaryIdentification: string;
  };
  DebtorAgent: {
    SchemeName: string;
    Identification: string;
    Name: string;
    PostalAddress: {
      AddressType: string;
      Department: string;
      SubDepartment: string;
      StreetName: string;
      BuildingNumber: string;
      PostCode: string;
      TownName: string;
      CountrySubDivision: string;
      Country: string;
      AddressLine: string[];
    };
  };
  DebtorAccount: {
    SchemeName: string;
    Identification: string;
    Name: string;
    SecondaryIdentification: string;
  };
  CardInstrument: {
    CardSchemeName: string;
    AuthorisationType: string;
    Name: string;
    Identification: string;
  };
}

// Represents the overall API response for accounts
export interface SpankkiAccountApiResponse {
  Data: SpankkiAccountData;
  Links: Links;
  Meta: Meta;
}

// Contains the list of accounts
export interface SpankkiAccountData {
  Account: SpankkiAccount[];
}

// Represents an individual account
export interface SpankkiAccount {
  AccountId: string;
  Status: string; // e.g., "Deleted"
  StatusUpdateDateTime: string;
  Currency: string; // regex pattern: ^AAA$
  AccountType: string; // e.g., "Business"
  AccountSubType: string; // e.g., "ChargeCard"
  Description: string;
  Nickname: string;
  OpeningDate: string;
  MaturityDate: string;
  SwitchStatus: string;
  Account: AccountDetail[];
  Servicer: Servicer;
}

// Represents account identification details
interface AccountDetail {
  SchemeName: string;
  Identification: string;
  Name: string;
  SecondaryIdentification: string;
}

// Represents servicer information
interface Servicer {
  SchemeName: string;
  Identification: string;
}

// Navigation links for paging
interface Links {
  Self: string;
  First: string;
  Prev: string;
  Next: string;
  Last: string;
}

// Metadata about the API response
interface Meta {
  TotalPages: number;
  FirstAvailableDateTime: string;
  LastAvailableDateTime: string;
}
