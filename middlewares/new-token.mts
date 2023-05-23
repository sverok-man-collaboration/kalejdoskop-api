import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import * as dotenv from "dotenv";
dotenv.config();

function getNewToken(token: string): string {
  const secret = process.env["SECRET_JWT"];
  if (!secret) return "SECRET_JWT is undefined";

  const decodedToken = verify(token, secret);
  if (typeof decodedToken === "string" || !decodedToken["userId"])
    return "Invalid token";

  const userId: number = decodedToken["userId"];
  const newToken = sign({ userId }, secret, { expiresIn: "1h" });
  return newToken;
}

export default getNewToken;
