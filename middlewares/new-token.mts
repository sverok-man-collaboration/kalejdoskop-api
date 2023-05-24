// JWT import
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

function getNewToken(token: string): string {
  const secret = process.env["SECRET_KEY"];
  if (!secret) return "SECRET_KEY is undefined";

  const decodedToken = verify(token, secret);
  if (typeof decodedToken === "string" || !decodedToken["userId"])
    return "Invalid token";

  const userId: number = decodedToken["userId"];
  const newToken = sign({ userId }, secret, { expiresIn: "1h" });
  return newToken;
}

export default getNewToken;
