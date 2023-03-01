import type { Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { createTransport } from "nodemailer";
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import errorLogging from "../middlewares/error-logging.mjs";

// Model imports
import { readData } from "../models/db.model.mjs";

// Type imports
import type { Database } from "../types/controllers.types.js";

// Email authentication method
const emailAuth = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const db = (await readData()) as Database;
    const user = db.users.admin.find((user) => user.email === email);

    if (user) {
      const secret = process.env["SECRET_JWT"];

      if (secret) {
        const token = sign({ userId: user.id }, secret, {
          expiresIn: "1h",
        });

        async function main() {
          let transporter = createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env["SECRET_USER"],
              pass: process.env["SECRET_PASS"],
            },
          });

          let info = await transporter.sendMail({
            to: `${email}`,
            subject: "Finish logging in",
            html: `<a href="http://localhost:4000/verify?token=${token}">Login</a>`,
          });

          console.log("Message sent: %s", info.messageId);
        }
        try {
          await main();
          res.send("Check your email to finish logging in");
        } catch (error) {
          if (
            typeof error === "object" &&
            error !== null &&
            "responseCode" in error
          ) {
            if (error.responseCode === 535) {
              console.log(error);
              res.statusMessage = "SMTP Error";
              errorLogging(error, __filename);
              res.status(535).end();
            } else {
              console.log(error);
              errorLogging(error, __filename);
              res.status(500).end();
            }
          } else {
            console.log(error);
            errorLogging(error, __filename);
            res.status(500).end();
          }
        }
      } else {
        const errorMessage = "process.env.SECRET_JWT is undefined";
        console.log(errorMessage);
        errorLogging(errorMessage, __filename);
        res.status(500).end();
      }
    } else {
      res.send("Check your email to finish logging in");
    }
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    res.status(500).end();
  }
};

// Verify user token method
const verifyUser = async (req: Request, res: Response) => {
  const token = req.query["token"]?.toString();
  const secret = process.env["SECRET_JWT"];

  if (secret && token) {
    try {
      const decodedToken = verify(token, secret);

      if (typeof decodedToken === "string" || !decodedToken["userId"]) {
        throw new Error("Invalid token");
      }
      try {
        const db = (await readData()) as Database;
        const user = db.users.admin.find(
          (user) => user.id === decodedToken["userId"]
        );

        if (user) {
          res.send(`Authenticated as ${user.name}`);
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
  } else if (token === undefined) {
    console.log("Not a token");
    res.status(400).end();
  } else {
    const errorMessage = "process.env.SECRET_JWT is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    res.status(500).end();
  }
};

export { emailAuth, verifyUser };
