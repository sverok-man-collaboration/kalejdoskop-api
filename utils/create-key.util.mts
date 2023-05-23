import crypto from "crypto";

function generateKey() {
  const secretKey = crypto.randomBytes(32).toString("hex");
  console.log(`Random JWT key: ${secretKey}`);
}

export default generateKey;
