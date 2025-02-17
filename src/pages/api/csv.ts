/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { handlePostCsv } from "@/server/controllers/csv/handlePostCsv";
import { TransactionsData } from "@/models/types";
import { handleGetCsv } from "@/server/controllers/csv/handleGetCsv";
import { handleRemoveCsv } from "@/server/controllers/csv/handleRemoveCsv";

export const config = {
  api: {
    bodyParser: false,
  },
};

type ResponseData = {
  message: string;
  data?: TransactionsData;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    await handlePostCsv(req, res);
  } else if (req.method === "GET") {
    await handleGetCsv(req, res);
  } else if (req.method === "DELETE") {
    await handleRemoveCsv(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
