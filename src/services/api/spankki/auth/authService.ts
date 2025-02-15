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
      Permissions: ["ReadAccountsBasic"],
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
