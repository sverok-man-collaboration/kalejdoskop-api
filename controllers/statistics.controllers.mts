import type { Request, Response } from "express";
import errorLogging from "../middlewares/error-logging.mjs";

// Model imports
import { readData, writeData } from "../models/db.model.mjs";

// Type imports
import type { Database } from "../types/controllers/controllers.js";

// Get all statistics method
const allStatistics = async (_req: Request, res: Response) => {
  try {
    const db = (await readData()) as Database;
    res.status(200).json(db.statistics);
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    res.status(500).end();
  }
};

// Post statistics to question 1 method
const postStatistics = async (req: Request, res: Response) => {
  const { answer } = req.body;
  const answerType = typeof answer;

  if (answerType === "string") {
    try {
      const db = (await readData()) as Database;
      const maxValue = Math.max(
        ...db.statistics.question1.map((number) => number.id)
      );
      db.statistics.question1.push({
        id: maxValue + 1,
        question: "Send dick pick to partner?",
        answer: answer,
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
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      res.status(500).end();
    }
  } else {
    res.status(400).end();
  }
};

export { allStatistics, postStatistics };
