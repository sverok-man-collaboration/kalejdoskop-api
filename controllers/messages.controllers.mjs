import errorLogging from "../middlewares/error-logging.mjs";

// Model imports
import { readData, writeData } from "../models/db.model.mjs";

// Get answer to question 1 method
const getAnswers1 = async (_req, res) => {
  try {
    const db = await readData();
    res.status(200).json(db.posts.question1);
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    res.status(500).end();
  }
};

// Post answer to question 1 method
const postAnswer1 = async (req, res) => {
  const { message } = req.body;
  const messageType = typeof message;

  if (messageType === "string") {
    let db;

    try {
      db = await readData();
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      res.status(500).end();
    }

    const maxValue = Math.max(
      ...db.posts.question1.map(
        (/** @type {{ id: number; }} */ number) => number.id
      )
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
  } else {
    res.status(400).end();
  }
};

// Patch answer to question 1 method
const patchAnswer1 = (_req, _res) => {};

// Delete answer to question 1 method
const deleteAnswer1 = (_req, _res) => {};

export { getAnswers1, postAnswer1, patchAnswer1, deleteAnswer1 };
