// Model imports
import {
  getAllUsers,
  postUser,
  deleteUser,
  getUser,
} from "../models/users.model.mjs";

// Middleware imports
import getNewToken from "../middlewares/new-token.mjs";
import encryptData from "../middlewares/encrypt-data.mjs";
import decryptData from "../middlewares/decrypt-data.mjs";
import errorLogging from "../middlewares/error-logging.mjs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

// Type imports
import type { Request, Response } from "express";

// Get all users method
const getAllUsersController = async (req: Request, res: Response) => {
  // Token has already been verified by authenticate-token middleware
  const authHeader = req.headers["authorization"]?.toString();
  const token = authHeader?.split(" ")[1] as string;

  // Get new Token
  const newToken = getNewToken(token);
  if (newToken === "Invalid token") {
    console.log("Invalid token");
    return res.status(401).end();
  } else if (newToken === "SECRET_KEY is undefined") {
    const errorMessage = "process.env.SECRET_KEY is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    return res.status(500).end();
  }

  try {
    const users = await getAllUsers();

    // Decrypting email and name
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
          throw new Error("Iv is undefined for user" + user.id);
        }
      } catch (error) {
        console.log(error);
        errorLogging(error, __filename);
      }
    }
    return res.status(200).json({ newToken, users });
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    return res.status(500).end();
  }
};

// Post user method
const postUserController = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  const emailType = typeof email;
  const nameType = typeof name;

  if (emailType !== "string" || nameType !== "string") {
    return res.status(400).end();
  }

  // Token has already been verified by authenticate-token middleware
  const authHeader = req.headers["authorization"]?.toString();
  const token = authHeader?.split(" ")[1] as string;

  // Get new Token
  const newToken = getNewToken(token);
  if (newToken === "Invalid token") {
    console.log("Invalid token");
    return res.status(401).end();
  } else if (newToken === "SECRET_KEY is undefined") {
    const errorMessage = "process.env.SECRET_KEY is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    return res.status(500).end();
  }

  // Encrypting email and name
  const emailLowerCase = email.toLowerCase();
  const { data, moreData, iv } = encryptData(emailLowerCase, name) || {};

  if (!data || !moreData) {
    const errorMessage = "process.env.SECRET_KEY is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    return res.status(500).end();
  } else if (!iv) {
    const errorMessage = "iv is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    return res.status(500).end();
  }

  // Check if user already exists
  const existingUsers = await getUser(data);
  if (existingUsers.length > 0) {
    return res.status(409).end();
  }

  try {
    await postUser(data, moreData, iv);
    return res.status(200).json({ newToken });
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    return res.status(500).end();
  }
};

// Delete user method
const deleteUserController = async (req: Request, res: Response) => {
  const userId = req.params["id"];
  if (!userId) {
    return res.status(400).end();
  }

  // Token has already been verified by authenticate-token middleware
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1] as string;

  // Get new Token
  const newToken = getNewToken(token);
  if (newToken === "Invalid token") {
    return res.status(401).end();
  } else if (newToken === "SECRET_KEY is undefined") {
    const errorMessage = "process.env.SECRET_KEY is undefined";
    errorLogging(errorMessage, __filename);
    return res.status(500).end();
  }

  const idNumber = parseInt(userId);
  try {
    await deleteUser(idNumber);
    return res.status(200).json({ newToken });
  } catch (error) {
    errorLogging(error, __filename);
    return res.status(500).end();
  }
};

export { getAllUsersController, postUserController, deleteUserController };
