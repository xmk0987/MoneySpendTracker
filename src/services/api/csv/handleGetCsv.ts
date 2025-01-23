import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/lib/redisDb";

export async function handleGetCsv(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      res.status(400).json({ message: "Invalid or missing ID" });
      return;
    }

    // Fetch the hash data from Redis
    const data = await client.hGetAll(id);

    if (!data || Object.keys(data).length === 0) {
      res.status(404).json({ message: "Data not found" });
      return;
    }

    // Parse the stored JSON strings back to objects
    const transactions = JSON.parse(data.transactions);
    const summary = JSON.parse(data.summary);

    const parsedData = { transactions, summary };

    res
      .status(200)
      .json({ message: "Data retrieved successfully!", data: parsedData });
  } catch (err: unknown) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
