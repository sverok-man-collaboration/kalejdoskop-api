import crypto from "crypto";

function generateJWT() {
  const secretKey = crypto.randomBytes(32).toString("hex");
  return console.log(`Random key: ${secretKey}`);
}

export default generateJWT;
