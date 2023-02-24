// @ts-nocheck
const errorLogging = require("../middlewares/error-logging");

// Model imports
const { readData, writeData } = require("../models/db.model");

// Get all users method
const allUsers = async (req, res) => {
  try {
    const db = await readData();
    res.status(200).json(db.users);
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    res.status(500).end();
  }
};

// Post user method
const postUser = async (req, res) => {
  const { email, name } = req.body;
  const emailType = typeof email;
  const nameType = typeof name;

  if (emailType === "string" && nameType === "string") {
    let db;
    let user = true;

    try {
      db = await readData();
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      res.status(500).end();
    }

    const emailLowercase = email.toLowerCase();
    user = db.users.admin.filter((user) => user.email === emailLowercase);

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
  } else {
    res.status(400).end();
  }
};

// Delete user method
const deleteUser = (req, res) => {};

module.exports = { allUsers, postUser, deleteUser };
