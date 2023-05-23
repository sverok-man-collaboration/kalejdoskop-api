import crypto from "crypto";
import * as dotenv from "dotenv";
dotenv.config();

// Encrypt data using AES-256-CBC algorithm, secret key and IV
function encryptData(data: string, moreData?: string) {
  const secretKey = process.env["SECRET_KEY"];
  if (!secretKey) return null;

  const algorithm = "aes-256-cbc";
  const iv = crypto.randomBytes(16);

  // Encrypt the main data
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, "hex"),
    iv
  );
  const encryptedData = Buffer.concat([cipher.update(data), cipher.final()]);

  // If additional data is provided, encrypt it as well
  if (moreData) {
    const cipher2 = crypto.createCipheriv(
      algorithm,
      Buffer.from(secretKey, "hex"),
      iv
    );
    const encryptedMoreData = Buffer.concat([
      cipher2.update(moreData),
      cipher2.final(),
    ]);

    return {
      data: encryptedData.toString("hex"),
      moreData: encryptedMoreData.toString("hex"),
      iv: iv.toString("hex"),
    };
  }

  return {
    data: encryptedData.toString("hex"),
    iv: iv.toString("hex"),
  };
}

export default encryptData;
