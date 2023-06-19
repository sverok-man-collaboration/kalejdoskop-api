// Middleware imports
import errorLogging from "./error-logging.mjs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

// Type imports
import type { Request, Response, NextFunction } from "express";

const originCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const origin = req.get("origin") as any;

  // Check if process.env.SECRET_API_KEY is undefined
  const allowedOrigins = process.env["ALLOWED_ORIGINS"];
  if (!allowedOrigins) {
    const errorMessage = "process.env.SECRET_API_KEY is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    res.status(500).end();
    return;
  }

  // If origin is allowed, bypass API key check
  const allowedOriginsArray = allowedOrigins.split(",");
  if (allowedOriginsArray.includes(origin)) {
    return next();
  }

  // Check if process.env.SECRET_API_KEY is undefined
  const apiKey = process.env["SECRET_API_KEY"];
  if (!apiKey) {
    const errorMessage = "process.env.SECRET_API_KEY is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    res.status(500).end();
    return;
  }

  // If origin is not allowed, check the API key
  const reqApiKey = req.get("X-API-KEY");
  if (reqApiKey !== apiKey) {
    console.log("Invalid API key");
    res.status(401).end();
    return;
  }

  next();
};

export default originCheck;
