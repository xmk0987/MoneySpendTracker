"use server";
import * as crypto from "crypto";

/**
 * Generates a random alphanumeric string to be used as the state parameter.
 *
 * @param length - The desired length of the random state string (default is 16).
 * @returns A random string.
 */
export function generateRandomState(length = 16): string {
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let state = "";
  for (let i = 0; i < length; i++) {
    state += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }
  return state;
}

export function computeDigest(payload: string): string {
  const hash = crypto.createHash("sha256").update(payload).digest("base64");
  return `SHA-256=${hash}`;
}
