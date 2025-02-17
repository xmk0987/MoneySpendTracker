// authService.ts
import axios from "axios";
import spankkiHttpAgent from "@/lib/httpAgents/spankkiHttpAgent";

const SPANKKI_TOKEN_ENDPOINT =
  "https://s-pankki-api-sandbox.crosskey.io/open-banking/v2.0/oidc/token";
const SPANKKI_ACCOUNT_CONSENTS_ENDPOINT =
  "https://s-pankki-api-sandbox.crosskey.io/open-banking/v3.1.6/aisp/account-access-consents";

/**
 * Obtains an access token using the OAuth2 client credentials grant.
 *
 * @param clientId - Your client ID.
 * @returns A promise resolving with the access token string.
 */
export async function getClientToken(clientId: string): Promise<string> {
  const formData = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "accounts",
    client_id: clientId,
  }).toString();

  const response = await axios.post(SPANKKI_TOKEN_ENDPOINT, formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    httpsAgent: spankkiHttpAgent,
  });

  if (!response.data.access_token) {
    throw new Error("Token not found");
  }
  return response.data.access_token;
}

/**
 * Obtains an access token for user.
 *
 * @param clientId - Your client ID.
 * @param redirectUri - Redirect uri taht was used in the hybrid flow
 * @param code - Authorization code received from OIDC hybrid flow of user.
 * @returns A promise resolving with the access token string.
 */
export async function getUserAccessToken(
  clientId: string,
  redirectUri: string,
  code: string
): Promise<{
  access_token: string;
  refresh_token: string;
  scope: string;
  id_token: string;
  token_type: string;
  expires_in: number;
}> {
  const formData = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
  }).toString();

  const response = await axios.post(SPANKKI_TOKEN_ENDPOINT, formData, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    httpsAgent: spankkiHttpAgent,
  });

  return response.data;
}

/**
 * Obtains an access token for user with refresh token.
 * @param clientId - Your client ID.
 * @param refreshToken - Refresh token
 * @returns A promise resolving with the access token string.
 */
export async function refreshAccessToken(
  clientId: string,
  refreshToken: string
): Promise<{
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}> {
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
  }).toString();

  const response = await axios.post(SPANKKI_TOKEN_ENDPOINT, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    httpsAgent: spankkiHttpAgent,
  });

  return response.data;
}

/**
 * Creates an account access consent and returns the consent ID.
 *
 * @param token - The access token obtained from getClientToken.
 * @returns A promise resolving with the consent ID.
 */
export async function createAccountAccessConsent(
  token: string
): Promise<string> {
  const now = new Date();
  const expirationDateTime = new Date(
    now.getTime() + 2 * 60 * 60 * 1000
  ).toISOString();
  const transactionToDateTime = now.toISOString();
  const transactionFromDateTime = new Date(
    now.getTime() - 365 * 24 * 60 * 60 * 1000
  ).toISOString();

  const payload = {
    Data: {
      Permissions: [
        "ReadAccountsBasic",
        "ReadAccountsDetail",
        "ReadBalances",
        "ReadTransactionsBasic",
        "ReadTransactionsCredits",
        "ReadTransactionsDebits",
        "ReadTransactionsDetail",
      ],
      ExpirationDateTime: expirationDateTime,
      TransactionFromDateTime: transactionFromDateTime,
      TransactionToDateTime: transactionToDateTime,
    },
  };

  const response = await axios.post(
    SPANKKI_ACCOUNT_CONSENTS_ENDPOINT,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "X-API-Key": process.env.SPANKKI_API_KEY,
      },
      httpsAgent: spankkiHttpAgent,
    }
  );

  const consentId = response.data.Data.ConsentId;
  if (!consentId) {
    throw new Error("Consent ID not found in response");
  }
  return consentId;
}

/**
 * Generates an openbanking intent ID using the consent ID.
 *
 * @param consentId - The consent ID from createAccountAccessConsent.
 * @returns The generated intent ID.
 */
export function generateIntentId(consentId: string): string {
  return `urn:s-pankki:account:${consentId}`;
}

/**
 * Generates a random alphanumeric string to be used as the state parameter.
 *
 * @param length - The desired length of the random state string (default is 16).
 * @returns A random string.
 */
export function generateRandomState(length = 16): string {
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let state = "";
  for (let i = 0; i < length; i++) {
    state += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }
  return state;
}
