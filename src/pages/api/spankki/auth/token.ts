"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import { logErrors } from "@/errors/logErrors";
import { getUserAccessToken } from "@/server/spankki/services/authService";
import { serialize } from "cookie";

// This route handles the fetching of token data for a verified user.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { code } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "Authorization code missing" });
    }

    const clientId = process.env.SPANKKI_CLIENT_ID;
    const redirectUri = process.env.SPANKKI_REDIRECT_URI;
    if (!clientId || !redirectUri) {
      return res.status(500).json({ message: "Missing client configuration" });
    }

    const accessTokenData = await getUserAccessToken(
      clientId,
      redirectUri,
      code
    );
    const { access_token, refresh_token, expires_in } = accessTokenData;

    res.setHeader("Set-Cookie", [
      serialize("access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: expires_in,
        path: "/",
      }),
      serialize("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      }),
    ]);

    res.status(200).json({ message: "Tokens set" });
  } catch (error: unknown) {
    logErrors(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
