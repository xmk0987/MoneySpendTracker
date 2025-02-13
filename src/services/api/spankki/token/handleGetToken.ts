import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import spankkiHttpAgent from "@/lib/httpAgents/spankkiHttpAgent";
import { handleErrors } from "@/errors/handleErrors";

export async function handleGetToken(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const clientId = process.env.SPANKKI_CLIENT_ID;

  if (!clientId) {
    return res.status(500).json({ message: "Client id is missing" });
  }

  // Explicitly convert the form data to a URL-encoded string
  const formData = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "accounts",
    client_id: clientId,
  }).toString();

  try {
    const response = await axios.post(
      "https://s-pankki-api-sandbox.crosskey.io/open-banking/v2.0/oidc/token",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        httpsAgent: spankkiHttpAgent,
      }
    );

    return res.status(200).json(response.data);
  } catch (error: unknown) {
    handleErrors(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
