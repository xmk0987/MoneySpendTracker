"use server";
import axios, { AxiosInstance } from "axios";
import { createSignature } from "@/server/nordea/utils/signature";

export async function createNordeaApi(
  endpoint: string
): Promise<AxiosInstance> {
  const nordeaBaseUri = process.env.NORDEA_BASE_URI;
  const clientId = process.env.NORDEA_CLIENT_ID;
  const clientSecret = process.env.NORDEA_CLIENT_SECRET;
  /*
  Currently has to be generated via nordea sandbox due to their
  api policies
  */
  const mockAccessToken = process.env.NORDEA_ACCESS_TOKEN;

  if (!nordeaBaseUri || !clientId || !clientSecret || !mockAccessToken) {
    throw new Error("Missing configuration");
  }

  console.log("Endpoint for api ", endpoint);

  const originatingDate = new Date().toUTCString();

  const { signature } = createSignature(endpoint, originatingDate, "GET");

  const instance = axios.create({
    baseURL: nordeaBaseUri,
    headers: {
      Authorization: `Bearer ${mockAccessToken}`,
      "X-IBM-Client-Id": clientId,
      "X-IBM-Client-Secret": clientSecret,
      Signature: signature,
      "X-Nordea-Originating-Host": "api.nordeaopenbanking.com",
      "X-Nordea-Originating-Date": originatingDate,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return instance;
}
