// lib/spankkiHttpAgent.js
"use server"
import https from "https";
import fs from "fs";
import path from "path";

const certPath =
  process.env.SPANKKI_TLS_CERT && path.resolve(process.env.SPANKKI_TLS_CERT);
const keyPath =
  process.env.SPANKKI_TLS_KEY && path.resolve(process.env.SPANKKI_TLS_KEY);

const cert = certPath ? fs.readFileSync(certPath) : undefined;
const key = keyPath ? fs.readFileSync(keyPath) : undefined;

/**
 * HTTPS Agent configured with TLS client certificates.
 * This agent is used during the TLS handshake to authenticate your client.
 */
const spankkiHttpAgent = new https.Agent({
  cert, // Client certificate
  key, // Corresponding private key
  // For production, ensure rejectUnauthorized is true to verify the server certificate.
  rejectUnauthorized: process.env.NODE_ENV === "production",
});

export default spankkiHttpAgent;
