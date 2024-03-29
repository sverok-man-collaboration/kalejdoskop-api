// Middleware imports
import errorLogging from "../middlewares/error-logging.mjs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

// Model imports
import {
  getAllGameStatistics,
  postGameStatistic,
  getAllDownloadStatistics,
  postDownloadStatistic,
} from "../models/statistics.model.mjs";

// Type imports
import type { Request, Response } from "express";

// Get all statistics method
const getAllStatisticsController = async (_req: Request, res: Response) => {
  try {
    const data = await getAllGameStatistics();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    return res.status(500).end();
  }
};

// Post statistic method
const postStatisticController = async (req: Request, res: Response) => {
  const { answerId } = req.body;
  const idType = typeof answerId;
  if (idType !== "number") {
    return res.status(400).end();
  }

  try {
    await postGameStatistic(answerId);
    return res.status(204).end();
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    return res.status(500).end();
  }
};

// Get all download statistics method
const getAllDownloadStatisticsController = async (
  _req: Request,
  res: Response
) => {
  try {
    const data = await getAllDownloadStatistics();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    return res.status(500).end();
  }
};

// Post download statistics method
const postDownloadStatisticsController = async (
  _req: Request,
  res: Response
) => {
  try {
    await postDownloadStatistic();
    return res.status(204).end();
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    return res.status(500).end();
  }
};

export {
  getAllStatisticsController,
  postStatisticController,
  getAllDownloadStatisticsController,
  postDownloadStatisticsController,
};
