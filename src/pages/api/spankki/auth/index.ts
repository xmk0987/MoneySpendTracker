/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getClientToken,
  createAccountAccessConsent,
  generateIntentId,
} from "@/server/services/spankki/authService";
import { generateRandomState } from "@/server/utils/helpers";
import { logErrors } from "@/errors/logErrors";
import jwt from "jsonwebtoken";
import fs from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const clientId = process.env.SPANKKI_CLIENT_ID;
    const redirectUri = process.env.SPANKKI_REDIRECT_URI;
    if (!clientId || !redirectUri) {
      return res.status(500).json({ message: "Missing client configuration" });
    }

    const clientToken = await getClientToken(clientId);

    const consentId = await createAccountAccessConsent(clientToken);

    const intentId = generateIntentId(consentId);

    const state = generateRandomState();
    const nonce = generateRandomState();

    const now = Math.floor(Date.now() / 1000);
    const nbf = now;
    const exp = now + 3600;

    const payload = {
      scope: "openid accounts",
      iss: clientId,
      state: state,
      redirect_uri: redirectUri,
      nonce: nonce,
      nbf: nbf,
      exp: exp,
      client_id: clientId,
      claims: {
        id_token: {
          openbanking_intent_id: { value: intentId, essential: true },
        },
      },
    };

    const privateKeyPath = process.env.SPANKKI_DS_KEY;
    if (!privateKeyPath) {
      return res.status(500).json({ message: "Missing private key path" });
    }
    const privateKey = fs.readFileSync(privateKeyPath, "utf8");

    const signedRequestObject = jwt.sign(payload, privateKey, {
      algorithm: "PS256",
    });

    const authorizationUrl = new URL(
      "https://s-pankki-sandbox.crosskey.io/open-banking/v4.0/oidc/auth"
    );
    authorizationUrl.searchParams.append("client_id", clientId);
    authorizationUrl.searchParams.append("redirect_uri", redirectUri);
    authorizationUrl.searchParams.append("scope", "openid accounts");
    authorizationUrl.searchParams.append("state", state);
    authorizationUrl.searchParams.append("response_type", "code id_token");
    authorizationUrl.searchParams.append("nonce", nonce);
    authorizationUrl.searchParams.append("request", signedRequestObject);

    res.redirect(authorizationUrl.toString());
  } catch (error: unknown) {
    logErrors(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
