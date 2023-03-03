import type { Request, Response } from "express";
import errorLogging from "../middlewares/error-logging.mjs";

// Model imports
import { readData, writeData } from "../models/db.model.mjs";

// Type imports
import type { Database } from "../types/controllers/controllers.js";

// Get answer to question 1 method
const getAnswers1 = async (_req: Request, res: Response) => {
  try {
    const db = (await readData()) as Database;
    res.status(200).json(db.posts.question1);
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    res.status(500).end();
  }
};

// Post answer to question 1 method
const postAnswer1 = async (req: Request, res: Response) => {
  const { message } = req.body;
  const messageType = typeof message;

  if (messageType === "string") {
    try {
      const db = (await readData()) as Database;
      const maxValue = Math.max(
        ...db.posts.question1.map((message) => message.id)
      );
      db.posts.question1.push({ id: maxValue + 1, message: message });
      const stringifiedJson = JSON.stringify(db);

      try {
        await writeData(stringifiedJson);
        res.status(204).end();
      } catch (error) {
        console.log(error);
        errorLogging(error, __filename);
        res.status(500).end();
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

// Patch answer to question 1 method
const patchAnswer1 = async (req: Request, res: Response) => {
  const { id, message } = req.body;
  const idType = typeof id;
  const messageType = typeof message;

  if (idType === "number" && messageType === "string") {
    try {
      const db = (await readData()) as Database;
      const messageFound = db.posts.question1.find(
        (message) => message.id === id
      );

      if (messageFound) {
        const messageIndex = db.posts.question1.findIndex((message) => {
          return message.id === id;
        });
        console.log(messageIndex);
        db.posts.question1.push({ id: id, message: message });
        db.posts.question1.splice(messageIndex, 1);
        const stringifiedJson = JSON.stringify(db);

        try {
          await writeData(stringifiedJson);
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

// Delete answer to question 1 method
const deleteAnswer1 = (_req: Request, _res: Response) => {};

export { getAnswers1, postAnswer1, patchAnswer1, deleteAnswer1 };
