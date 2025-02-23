import type { NextApiRequest, NextApiResponse } from "next";
import { logErrors } from "@/errors/logErrors";
import { createNordeaApi } from "@/server/axiosConfig/nordea/nordeaAxiosInstance";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const nordeaBaseUri = process.env.NORDEA_BASE_URI;
    const clientId = process.env.NORDEA_CLIENT_ID;
    const clientSecret = process.env.NORDEA_CLIENT_SECRET;

    if (!nordeaBaseUri || !clientId || !clientSecret) {
      throw new Error("Missing configuration");
    }
    const endpoint = "/personal/v5/accounts";

    console.log("Mock get accounts");

    const nordeaApi = await createNordeaApi(endpoint);

    const accountsResponse = await nordeaApi.get("/v5/accounts");

    const accounts = accountsResponse.data.accounts;

    if (!accounts || accounts.length === 0) {
      return res.status(200).json({ message: "No accounts found" });
    }

    console.log("received accounts ", accountsResponse.data.accounts);
  } catch (error) {
    logErrors(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
