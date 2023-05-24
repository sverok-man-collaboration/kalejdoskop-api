import crypto from "crypto";
import * as dotenv from "dotenv";
dotenv.config();

// Decrypt data using AES-256-CBC algorithm, secret key and IV
function decryptData(data: string, iv: string) {
  const secretKey = process.env["SECRET_KEY"];
  if (!secretKey) return null;

  // Decrypt the main data
  const algorithm = "aes-256-cbc";
  const extractedIV = Buffer.from(iv, "hex");
  const extractedSecretKey = Buffer.from(secretKey, "hex");
  const decipher = crypto.createDecipheriv(algorithm, extractedSecretKey, extractedIV);
  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(data, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
}

export default decryptData;
