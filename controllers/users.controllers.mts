import type { Request, Response } from "express";
import errorLogging from "../middlewares/error-logging.mjs";

// Model imports
import { readData, writeData } from "../models/db.model.mjs";

// Type imports
import type { Database } from "../types/controllers.types.js";

// Get all users method
const allUsers = async (_req: Request, res: Response) => {
  try {
    const db = (await readData()) as Database;
    res.status(200).json(db.users);
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
      const db = (await readData()) as Database;
      const emailLowercase: string = email.toLowerCase();
      const user = db.users.admin.filter(
        (user) => user.email === emailLowercase
      );
      if (user.length < 1) {
        const maxValue = Math.max(...db.users.admin.map((number) => number.id));
        db.users.admin.push({
          id: maxValue + 1,
          email: email,
          name: name,
        });
        const stringifiedJson = JSON.stringify(db);

        try {
          await writeData(stringifiedJson);
          res.status(204).end();
        } catch (error) {
          console.log(error);
          errorLogging(error, __filename);
          res.status(500).end();
        }
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
const deleteUser = (_req: Request, _re: Response) => {};

export { allUsers, postUser, deleteUser };
