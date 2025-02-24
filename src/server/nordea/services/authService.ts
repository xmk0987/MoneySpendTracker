"use server";
import axios from "axios";
import { generateRandomState } from "@/utils/helpers";
import { createSignature } from "./signature";

export async function getNordeaAuthorizationResponse() {
  try {
    const nordeaBaseUri = process.env.NORDEA_BASE_URI;
    const clientId = process.env.NORDEA_CLIENT_ID;
    const clientSecret = process.env.NORDEA_CLIENT_SECRET;

    if (!nordeaBaseUri || !clientId || !clientSecret) {
      throw new Error("Missing configuration");
    }

    const payload = {
      country: "FI",
      redirect_uri: process.env.NORDEA_REDIRECT_URI,
      scope: [
        "ACCOUNTS_BALANCES",
        "ACCOUNTS_BASIC",
        "ACCOUNTS_DETAILS",
        "ACCOUNTS_TRANSACTIONS",
        "CARDS_TRANSACTIONS",
      ],
      state: generateRandomState(),
      authentication_method: "BANKID_SE",
      duration: 3600,
      language: "fi",
      skip_account_selection: true,
    };

    const payloadString = JSON.stringify(payload);
    const endpoint = "/personal/v5/authorize";
    const originatingDate = new Date().toUTCString();

    const { digest, signature } = createSignature(
      endpoint,
      originatingDate,
      "POST",
      payloadString
    );

    const headers = {
      "X-Nordea-Originating-Host": "api.nordeaopenbanking.com",
      "X-Nordea-Originating-Date": originatingDate,
      "Content-Type": "application/json",
      Digest: digest,
      Signature: signature,
      "X-IBM-Client-Id": clientId,
      "X-IBM-Client-Secret": clientSecret,
      Accept: "application/json",
    };

    const config = {
      method: "post",
      url: `${nordeaBaseUri}/v5/authorize`,
      headers,
      data: payloadString,
    };

    console.log("Request sent to nordea");
    const response = await axios.request(config);

    console.log("Nordea answewred", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during Nordea authorization:", error);
    throw error;
  }
}
