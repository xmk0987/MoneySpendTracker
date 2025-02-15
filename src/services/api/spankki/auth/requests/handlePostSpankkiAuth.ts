import type { NextApiRequest, NextApiResponse } from "next";
import {
  getClientToken,
  createAccountAccessConsent,
  generateIntentId,
} from "../authService";
import { handleErrors } from "@/errors/handleErrors";

export default async function handlePostSpankkiAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const clientId = process.env.SPANKKI_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ message: "Client ID is missing" });
    }

    const clientToken = await getClientToken(clientId);

    const consentId = await createAccountAccessConsent(clientToken);

    const intentId = generateIntentId(consentId);

    return res
      .status(200)
      .json({ intentId, message: "Proceed with user approval" });
  } catch (error: unknown) {
    handleErrors(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
