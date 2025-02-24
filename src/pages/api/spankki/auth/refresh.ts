"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import { logErrors } from "@/errors/logErrors";
import { serialize } from "cookie";
import { refreshAccessToken } from "@/server/spankki/services/authService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    const clientId = process.env.SPANKKI_CLIENT_ID;
    if (!clientId) {
      return res.status(500).json({ message: "Missing client configuration" });
    }

    const {
      access_token,
      refresh_token: newRefreshToken,
      expires_in,
    } = await refreshAccessToken(clientId, refresh_token);

    res.setHeader("Set-Cookie", [
      serialize("access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: expires_in,
        path: "/",
      }),
      serialize("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      }),
    ]);

    return res.status(200).json({
      message: "Token refreshed successfully",
      access_token,
      refresh_token: newRefreshToken,
      expires_in,
    });
  } catch (error: unknown) {
    logErrors(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
