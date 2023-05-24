// JWT import
import pkg from "jsonwebtoken";
const { verify } = pkg;

// Model imports
import { verifyUserId } from "../models/users.model.mjs";

// Middleware imports
import errorLogging from "../middlewares/error-logging.mjs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

// Type imports
import type { Request, Response, NextFunction } from "express";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]?.toString();
  const token = authHeader?.split(" ")[1];
  const secret = process.env["SECRET_KEY"];

  if (!token) {
    const errorMessage = "Invalid token";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    return res.status(400).end();
  } else if (!secret) {
    const errorMessage = "process.env.SECRET_KEY is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    return res.status(400).end();
  }

  try {
    const decodedToken = verify(token, secret);

    if (typeof decodedToken === "string" || !decodedToken["userId"]) {
      throw new Error("Invalid token");
    }

    const data = await verifyUserId(decodedToken["userId"]);
    const user = data[0];

    if (!user) {
      return res.status(404).end();
    }

    return next();
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    return res.status(401).end();
  }
};

export { verifyToken };
