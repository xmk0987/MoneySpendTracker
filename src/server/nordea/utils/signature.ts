"use server";
import QsealcSignature from "@/lib/nordea/qsealcSignature";
import { computeDigest } from "@/utils/helpers";

export const createSignature = (
  endpoint: string,
  originDate: string,
  type: "GET" | "POST",
  payload?: string
) => {
  const p12Path = process.env.NORDEA_P12_PATH;
  const p12Pin = process.env.NORDEA_P12_PIN;

  if (!p12Path || !p12Pin) {
    throw new Error("Missing configuration");
  }

  const qsealc = new QsealcSignature({
    password: p12Pin,
    p12SignaturePath: p12Path,
  });

  if (type === "POST") {
    if (!payload) throw new Error("Payload needed for post signature");

    const digest = computeDigest(payload);
    const signatureHeader = qsealc.getPostMethodSignature(
      digest,
      endpoint,
      originDate
    );
    return { digest, signature: signatureHeader };
  } else {
    const signatureHeader = qsealc.getGetMethodSignature(endpoint, originDate);
    return { signature: signatureHeader };
  }
};
