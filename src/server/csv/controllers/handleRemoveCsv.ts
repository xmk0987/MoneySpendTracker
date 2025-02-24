"use server";
import type { NextApiRequest, NextApiResponse } from "next";
import client from "@/lib/redisDb";

export async function handleRemoveCsv(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      res.status(400).json({ message: "Invalid or missing ID" });
      return;
    }

    const exists = await client.exists(id);

    if (!exists) {
      res.status(404).json({ message: "Data not found" });
      return;
    }

    const deletedCount = await client.del(id);

    if (deletedCount === 1) {
      res.status(200).json({ message: "Data removed successfully!" });
    } else {
      res.status(500).json({ message: "Failed to remove data." });
    }
  } catch (err: unknown) {
    console.error("Error removing data:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
