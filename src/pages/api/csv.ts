/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import { handlePostCsv } from "@/services/api/csv/handlePostCsv";
import { CsvData } from "@/models/types";
import { handleGetCsv } from "@/services/api/csv/handleGetCsv";

export const config = {
  api: {
    bodyParser: false,
  },
};

type ResponseData = {
  message: string;
  data?: CsvData;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "POST") {
    await handlePostCsv(req, res);
  } else if (req.method === "GET") {
    await handleGetCsv(req, res);
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
