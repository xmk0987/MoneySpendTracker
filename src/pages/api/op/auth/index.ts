"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import { logErrors } from "@/errors/logErrors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const clientId = process.env.SPANKKI_CLIENT_ID;
    const redirectUri = process.env.SPANKKI_REDIRECT_URI;
    if (!clientId || !redirectUri) {
      return res.status(500).json({ message: "Missing client configuration" });
    }

  
  } catch (error: unknown) {
    logErrors(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
