/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import { logErrors } from "@/errors/logErrors";
import { getNordeaAuthorizationResponse } from "@/server/nordea/authService";

/**
 * !Currently the nordea auth flow is only allowed in production
 * !and cant be tested through own code, tokens can be taken from the sandbox environment.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const clientId = process.env.NORDEA_CLIENT_ID;
    const clientSecret = process.env.NORDEA_CLIENT_SECRET;
    const redirectUri = process.env.NORDEA_REDIRECT_URI;
    if (!clientId || !redirectUri || !clientSecret) {
      return res.status(500).json({ message: "Missing client configuration" });
    }

    const responseData = await getNordeaAuthorizationResponse();

    console.log("Response data", responseData);

    res.status(200).json({ data: responseData });
  } catch (error: unknown) {
    logErrors(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
