"use server";
import https from "https";
import fs from "fs";
import path from "path";

const certPath =
  process.env.OP_MTLS_CERT_PATH && path.resolve(process.env.OP_MTLS_CERT_PATH);
const keyPath =
  process.env.OP_MTLS_KEY_PATH && path.resolve(process.env.OP_MTLS_KEY_PATH);

const cert = certPath ? fs.readFileSync(certPath) : undefined;
const key = keyPath ? fs.readFileSync(keyPath) : undefined;

/**
 * HTTPS Agent configured with TLS client certificates.
 * This agent is used during the TLS handshake to authenticate your client.
 */
const opHttpAgent = new https.Agent({
  cert,
  key,
  rejectUnauthorized: process.env.NODE_ENV === "production",
});

export default opHttpAgent;
