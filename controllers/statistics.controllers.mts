import type { Request, Response } from "express";
import errorLogging from "../middlewares/error-logging.mjs";

// Model imports
import {
  getAllGameStatistics,
  addGameStatistic,
} from "../models/statistics.model.mjs";

// Get all statistics method
const allStatistics = async (_req: Request, res: Response) => {
  try {
    const data = await getAllGameStatistics();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    res.status(500).end();
  }
};

// Post statistic method
const postStatistics = async (req: Request, res: Response) => {
  const { answerId } = req.body;
  const idType = typeof answerId;
  if (idType === "number") {
    try {
      await addGameStatistic(answerId);
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

export { allStatistics, postStatistics };
