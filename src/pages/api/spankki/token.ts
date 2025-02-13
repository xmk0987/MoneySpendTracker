/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { handleGetToken } from "@/services/api/spankki/token/handleGetToken";

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
    await handleGetToken(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
