"use server"
import * as fs from "fs";
import * as crypto from "crypto";
import forge from "node-forge";


export default class QsealcSignature {
  password: string;
  p12SignaturePath: string;
  privateKey: crypto.KeyObject;

  constructor({
    password,
    p12SignaturePath,
  }: {
    password: string;
    p12SignaturePath: string;
  }) {
    this.password = password;
    this.p12SignaturePath = p12SignaturePath;
    this.privateKey = this.loadPrivateKey();
  }

  private loadPrivateKey(): crypto.KeyObject {
    const p12Buffer = fs.readFileSync(this.p12SignaturePath);
    const p12Der = forge.util.createBuffer(p12Buffer.toString("binary"));
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, this.password);
    const keyBags = p12.getBags({
      bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
    });
    const bags = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag];
    if (!bags || bags.length === 0) {
      throw new Error("No key bags found in the PKCS#12 file.");
    }
    const keyObj = bags[0].key;

    if (!keyObj) {
      throw new Error("Key not found");
    }

    const privateKeyPem = forge.pki.privateKeyToPem(keyObj);
    return crypto.createPrivateKey(privateKeyPem);
  }

  public getPostMethodSignature(
    digest: string,
    endpoint: string,
    date: string
  ): string {
    const headers = {
      "(request-target)": null,
      "X-Nordea-Originating-Host": "api.nordeaopenbanking.com",
      "X-Nordea-Originating-Date": date,
      "Content-Type": "application/json",
      Digest: digest,
    };

    return this.getSignatureHeader("POST", endpoint, headers);
  }

  public getGetMethodSignature(endpoint: string, date: string): string {
    const headers = {
      "(request-target)": null,
      "X-Nordea-Originating-Host": "api.nordeaopenbanking.com",
      "X-Nordea-Originating-Date": date,
    };

    return this.getSignatureHeader("GET", endpoint, headers);
  }

  public getSignatureHeader(
    method: string,
    path: string,
    headers: Record<string, string | null>
  ): string {
    const headerKeys = Object.keys(headers);
    const canonicalHeaders = headerKeys
      .map((key) => {
        if (key === "(request-target)") {
          return `(request-target): ${method.toLowerCase()} ${path}`;
        }
        return `${key.toLowerCase()}: ${headers[key]}`;
      })
      .join("\n");

    const signer = crypto.createSign("RSA-SHA256");
    signer.update(canonicalHeaders);
    signer.end();
    const signature = signer.sign(this.privateKey, "base64");

    const clientId = process.env.NORDEA_CLIENT_ID;

    if (!clientId) {
      throw new Error("Client id is missing");
    }

    const signedHeaders = headerKeys.map((k) => k.toLowerCase()).join(" ");
    return `keyId="${clientId}",algorithm="rsa-sha256",headers="${signedHeaders}",signature="${signature}"`;
  }
}
