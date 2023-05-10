import type { Request, Response } from "express";
import * as dotenv from "dotenv";
dotenv.config();
import { createTransport } from "nodemailer";
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import errorLogging from "../middlewares/error-logging.mjs";

// Model imports
import { verifyUserEmail, verifyUserId } from "../models/users.model.mjs";

// Email authentication method
const emailAuth = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const emailLowercase: string = email.toLowerCase();
    const data = await verifyUserEmail(emailLowercase);
    if (data.length > 0) {
      const user = data[0];

      if (user) {
        const secret = process.env["SECRET_JWT"];

        if (secret) {
          const token = sign({ userId: user.id }, secret, {
            expiresIn: "8h",
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
              html: `<a href="http://localhost:4000/login/verify?token=${token}">Login</a>`,
            });

            console.log(
              "Email authentication message sent: %s",
              info.messageId
            );
          }
          try {
            await main();
            res.send("Check your email to finish logging in");
          } catch (error) {
            if (typeof error === "object" && error && "responseCode" in error) {
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
  console.log("User verified");

  if (secret && token) {
    try {
      const decodedToken = verify(token, secret);

      if (typeof decodedToken === "string" || !decodedToken["userId"]) {
        throw new Error("Invalid token");
      }
      try {
        const data = await verifyUserId(decodedToken["userId"]);
        const user = data[0];
        if (user) {
          res.redirect(`http://localhost:5173?token=${encodeURIComponent(token)}`);
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
