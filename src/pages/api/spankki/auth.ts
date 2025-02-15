/* eslint-disable @typescript-eslint/no-explicit-any */
import handlePostSpankkiAuth from "@/services/api/spankki/auth/requests/handlePostSpankkiAuth";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await handlePostSpankkiAuth(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
