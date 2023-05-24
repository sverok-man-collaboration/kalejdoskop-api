// Nodemailer import
import { createTransport } from "nodemailer";

// JWT import
import pkg from "jsonwebtoken";
const { sign, verify } = pkg;

// Model imports
import { verifyUserId, getAllUsers } from "../models/users.model.mjs";

// Middleware imports
import decryptData from "../middlewares/decrypt-data.mjs";
import errorLogging from "../middlewares/error-logging.mjs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

// Type imports
import type { Request, Response } from "express";

// Email authentication method
const emailAuth = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const emailLowercase = email.toLowerCase();
    const users = await getAllUsers();

    // Decrypt name and email
    for (const user of users) {
      try {
        if (user.iv) {
          const decryptedName = decryptData(user.name, user.iv);
          const decryptedEmail = decryptData(user.email, user.iv);

          if (decryptedName && decryptedEmail) {
            user.name = decryptedName;
            user.email = decryptedEmail;
            delete user.iv;
          } else {
            throw new Error("process.env.SECRET_KEY is undefined");
          }
        } else {
          throw new Error(`Iv is undefined for user ${user.id}`);
        }
      } catch (error) {
        console.log(error);
        errorLogging(error, __filename);
      }
    }

    // Test if user exist
    const user = await users.find((user) => user.email === emailLowercase);
    if (!user) {
      res.send("Kontrollera din e-post för att slutföra inloggningen.");
      return;
    }

    // If secret key not found, throw error
    const secret = process.env["SECRET_KEY"];
    if (!secret) {
      throw new Error("process.env.SECRET_KEY is undefined");
    }

    // Create JWT token with user ID and secret key
    const token = sign({ userId: user.id }, secret, {
      algorithm: "HS256",
      expiresIn: "1h",
    });

    // Create email transporter
    let transporter = createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env["SECRET_USER"],
        pass: process.env["SECRET_PASS"],
      },
    });

    // Send verification email to user's email address
    let info = await transporter.sendMail({
      to: email,
      subject: "Slutför inloggningen",
      html: `<a href="http://localhost:4000/login/verify?token=${token}">Logga in länk</a>`,
    });

    console.log("Email authentication message sent: %s", info.messageId);
    res.send("Kontrollera din e-post för att slutföra inloggningen.");

    // Handle errors
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
};

// Verify user token method
const verifyUser = async (req: Request, res: Response) => {
  const token = req.query["token"]?.toString();
  if (!token) {
    console.log("Not a token");
    res.status(400).end();
    return;
  }

  // If secret key not found, throw error
  const secretKey = process.env["SECRET_KEY"];
  if (!secretKey) {
    const errorMessage = "process.env.SECRET_KEY is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    res.status(500).end();
    return;
  }

  try {
    // Verify the token with the secret key
    const decodedToken = verify(token, secretKey);

    // If the decoded token is not an object or it doesn't have a "userId" property, throw an error
    if (typeof decodedToken === "string" || !decodedToken["userId"]) {
      throw new Error("Invalid token");
    }

    // If user exists, redirect to a URL with the token in the query string
    const [user] = await verifyUserId(decodedToken["userId"]);
    if (user) {
      const redirectUrl = `http://localhost:5173?token=${encodeURIComponent(
        token
      )}`;
      console.log("User verified");
      res.redirect(redirectUrl);
    } else {
      console.log("User not found");
      res.status(404).end();
    }
  } catch (error) {
    console.log("Invalid token");
    res.status(401).end();
  }
};

export { emailAuth, verifyUser };
