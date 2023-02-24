const errorLogging = require("../middlewares/error-logging");

// Model imports
const { readData, writeData } = require("../models/db.model");

// Get all users method

const allUsers = async (_req, res) => {
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

    try {
      db = await readData();
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      res.status(500).end();
    }

    /** @type {string} */
    const emailLowercase = email.toLowerCase();

    /** @type {Array<string>} */
    const user = db.users.admin.filter(
      (/** @type {{ email: string; }} */ user) => user.email === emailLowercase
    );

    if (user.length < 1) {
      const maxValue = Math.max(
        ...db.users.admin.map(
          (/** @type {{ id: number; }} */ number) => number.id
        )
      );
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
const deleteUser = (_req, _res) => {};

module.exports = { allUsers, postUser, deleteUser };
