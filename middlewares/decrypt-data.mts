// Crypto import
import crypto from "crypto";

// Decrypt data using AES-256-CBC algorithm, secret key and IV
function decryptData(data: string, iv: string) {
  const secretKey = process.env["SECRET_KEY"];
  if (!secretKey) return null;

  const algorithm = "aes-256-cbc";
  const extractedIV = Buffer.from(iv, "hex");
  const extractedSecretKey = Buffer.from(secretKey, "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    extractedSecretKey,
    extractedIV
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString();
}

export default decryptData;
