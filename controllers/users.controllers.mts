// Model imports
import {
  getAllUsers,
  addUser,
  verifyUserEmail,
  removeUser,
} from "../models/users.model.mjs";

// Middleware imports
import newTokenResponse from "../middlewares/new-token.mjs";
import errorLogging from "../middlewares/error-logging.mjs";

// Type imports
import type { Request, Response } from "express";

// Get all users method
const allUsers = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"]?.toString();

  // Token has already been verified by authenticate-token middleware
  const token = authHeader?.split(" ")[1] as string;
  const newToken = newTokenResponse(token, res);

  if (!newToken) {
    return;
  }

  try {
    const users = await getAllUsers();
    res.status(200).json({ newToken, users });
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    res.status(500).end();
  }
};

// Post user method
const postUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  const authHeader = req.headers["authorization"]?.toString();

  // Token has already been verified by authenticate-token middleware
  const token = authHeader?.split(" ")[1] as string;
  const newToken = newTokenResponse(token, res);

  if (!newToken) {
    return;
  }

  const emailType = typeof email;
  const nameType = typeof name;

  if (emailType === "string" && nameType === "string") {
    try {
      const emailLowercase: string = email.toLowerCase();
      const data = await verifyUserEmail(emailLowercase);
      if (data.length < 1) {
        try {
          await addUser(emailLowercase, name);
          res.status(204).json({ newToken });
        } catch (error) {
          console.log(error);
          errorLogging(error, __filename);
          res.status(500).end();
        }
      } else {
        res.status(409).end();
      }
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      res.status(500).end();
    }
  } else {
    res.status(400).end();
  }
};

// Delete user method
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authHeader = req.headers["authorization"]?.toString();

  // Token has already been verified by authenticate-token middleware
  const token = authHeader?.split(" ")[1] as string;
  const newToken = newTokenResponse(token, res);

  if (!newToken) {
    return;
  }

  if (id) {
    const idNumber = parseInt(id);
    try {
      await removeUser(idNumber);
      res.status(204).json({ newToken });
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      res.status(500).end();
    }
  } else {
    res.status(400).end();
  }
};

export { allUsers, postUser, deleteUser };
