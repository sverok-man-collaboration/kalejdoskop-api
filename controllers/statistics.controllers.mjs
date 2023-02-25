import errorLogging from "../middlewares/error-logging.mjs";

// Model imports
import { readData, writeData } from "../models/db.model.mjs";

// Get all statistics method
const allStatistics = async (_req, res) => {
  try {
    const db = await readData();
    res.status(200).json(db.statistics);
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    res.status(500).end();
  }
};

// Post statistics to question 1 method
const postStatistics = async (req, res) => {
  const { answer } = req.body;
  const answerType = typeof answer;

  if (answerType === "string") {
    let db;

    try {
      db = await readData();
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      res.status(500).end();
    }

    const maxValue = Math.max(
      ...db.statistics.question1.map(
        (/** @type {{ id: number; }} */ number) => number.id
      )
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
  } else {
    res.status(400).end();
  }
};

export { allStatistics, postStatistics };
