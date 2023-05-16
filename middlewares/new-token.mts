import type { Response } from "express";
import errorLogging from "../middlewares/error-logging.mjs";
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import * as dotenv from "dotenv";
dotenv.config();

function newTokenResponse(token: string, res: Response) {
  const secret = process.env["SECRET_JWT"];
  if (secret) {
    const decodedToken = verify(token, secret);

    if (typeof decodedToken === "string" || !decodedToken["userId"]) {
      console.log("Invalid token");
      res.status(401).end();
      return;
    } else {
      const userId: number = decodedToken["userId"];
      const newToken = sign({ userId: userId }, secret, {
        expiresIn: "1h",
      });

      return newToken;
    }
  } else {
    const errorMessage = "process.env.SECRET_JWT is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    res.status(500).end();
    return;
  }
}

export default newTokenResponse;
