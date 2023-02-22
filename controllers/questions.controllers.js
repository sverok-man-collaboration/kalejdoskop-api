// @ts-nocheck
const fs = require("fs");

// Model imports
const { jsonData, writeData } = require("../models/db.model");

// Get answer to question 1 method
const getAnswers1 = async (req, res) => {
  try {
    const db = await jsonData();
    res.status(200).json(db.posts.question1);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

// Add answer to question 1 method
const addAnswer1 = async (req, res) => {
  try {
    const db = await jsonData();
    const { message } = req.body;
    const messageType = typeof message;

    if (messageType === "string") {
      const maxValue = Math.max(
        ...db.posts.question1.map((number) => number.id)
      );
      db.posts.question1.push({ id: maxValue + 1, message: message });
      const stringifiedJson = JSON.stringify(db);

      try {
        await writeData(stringifiedJson);
        res.status(204).end();
      } catch (error) {
        console.log(error);
        res.status(500).end();
      }
    } else {
      res.status(400).end();
    }
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

module.exports = { getAnswers1, addAnswer1 };
