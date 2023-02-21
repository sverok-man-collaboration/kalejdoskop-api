// @ts-nocheck
const fs = require("fs");

// Model imports
const { jsonData } = require("../models/db.model");

const getAnswers1 = async (req, res) => {
  try {
    const db = await jsonData();
    res.status(200).json(db.posts.question1);
  } catch (error) {
    res.status(500).end();
  }
};

const addAnswer1 = async (req, res) => {
  let db;
  try {
    db = await jsonData();
  } catch (error) {
    res.status(500).end();
  }
  const { message } = req.body;
  const messageType = typeof message;
  if (messageType === "string") {
    const maxValue = Math.max(...db.posts.question1.map((number) => number.id));
    console.log(maxValue);

    db.posts.question1.push({ id: maxValue + 1, message: message });
    const stringifiedJson = JSON.stringify(db);
    fs.writeFile("./db/db.json", stringifiedJson, (error) => {
      if (error) throw error;
      else {
        res.status(204).end();
      }
    });
  } else {
    res.status(400).end();
  }
};

module.exports = { getAnswers1, addAnswer1 };
