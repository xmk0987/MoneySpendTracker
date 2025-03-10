/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import formidable from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { processCsvFile } from "../services/csvService";
import type { RequiredHeaders } from "@/types/types";

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function handlePostCsv(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
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

    const mapping: RequiredHeaders = JSON.parse(fields.mapping as string);

    const uploadedFile = files.file;
    if (!uploadedFile) {
      res.status(400).json({ message: "File not found" });
      return;
    }

    const fileObj = Array.isArray(uploadedFile)
      ? uploadedFile[0]
      : uploadedFile;

    const filePath = fileObj.filepath || fileObj.path;

    const fileName =
      fileObj.originalFilename ||
      fileObj.name ||
      fileObj.newFilename ||
      "unknown";

    const dashboardData = await processCsvFile(filePath, mapping, fileName);

    res.status(201).json({
      message: "CSV processed successfully!",
      data: dashboardData,
    });
  } catch (err: unknown) {
    console.error("Error processing form data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
