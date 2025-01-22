/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { processCsvFile } from "@/services/csvProcessor";
import type { CSVMapping } from "@/models/csv";
import { CsvData } from "@/services/csvProcessor";

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
  console.log("Arrives");
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const form = formidable({});

  const parseForm = (): Promise<{
    fields: Record<string, any>;
    files: Record<string, any>;
  }> =>
    new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

  try {
    const { fields, files } = await parseForm();

    const mapping: CSVMapping = JSON.parse(fields.mapping as string);

    const uploadedFile = files.file;
    if (!uploadedFile) {
      res.status(400).json({ message: "File not found" });
      return;
    }

    const fileObj = Array.isArray(uploadedFile)
      ? uploadedFile[0]
      : uploadedFile;
    const filePath = fileObj.filepath;

    const { transactions, summary } = await processCsvFile(filePath, mapping);

    res.status(200).json({
      message: "CSV processed successfully!",
      data: { transactions, summary },
    });
  } catch (err: any) {
    console.error("Error processing form data:", err);
    res.status(err.httpCode || 400).json({ message: String(err) });
  }
}
