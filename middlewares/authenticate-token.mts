import type { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import pkg from "jsonwebtoken";
const { verify } = pkg;
import errorLogging from "../middlewares/error-logging.mjs";

// Model imports
import { verifyUserId } from "../models/users.model.mjs";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]?.toString();
  const token = authHeader?.split(" ")[1];
  const secret = process.env["SECRET_JWT"];

  if (secret && token) {
    try {
      const decodedToken = verify(token, secret);

      if (typeof decodedToken === "string" || !decodedToken["userId"]) {
        res.status(401).end();
        throw new Error("Invalid token");
      }
      try {
        const data = await verifyUserId(decodedToken["userId"]);
        const user = data[0];
        if (user) {
          next();
        } else {
          res.status(404).end();
        }
      } catch (error) {
        console.log(error);
        errorLogging(error, __filename);
        res.status(500).end();
      }
    } catch (error) {
      console.log("Invalid token");
      res.status(401).end();
    }
  } else if (authHeader === undefined) {
    console.log("Not a token");
    res.status(400).end();
  } else {
    const errorMessage = "process.env.SECRET_JWT is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    res.status(500).end();
  }
};

export { verifyToken };
