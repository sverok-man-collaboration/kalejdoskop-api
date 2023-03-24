import type { Request, Response } from "express";
import errorLogging from "../middlewares/error-logging.mjs";

// Model imports
import {
  getAllUsers,
  addUser,
  getUser,
  removeUser,
} from "../models/users.model.mjs";

// Get all users method
const allUsers = async (_req: Request, res: Response) => {
  try {
    const data = await getAllUsers();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    res.status(500).end();
  }
};

// Post user method
const postUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  const emailType = typeof email;
  const nameType = typeof name;

  if (emailType === "string" && nameType === "string") {
    try {
      const emailLowercase: string = email.toLowerCase();
      const data = await getUser(emailLowercase);
      if (data.length < 1) {
        try {
          await addUser(emailLowercase, name);
          res.status(204).end();
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
  console.log(id);
  if (id) {
    const idNumber = parseInt(id);
    try {
      const data = await removeUser(idNumber);
      console.log(data);
      res.status(204).end();
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
