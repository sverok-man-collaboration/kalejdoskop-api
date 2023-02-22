// @ts-nocheck
const errorLogging = require("../middlewares/errorLogging");

// Model imports
const { readData } = require("../models/db.model");

// Get all statistics method
const allStatistics = async (req, res) => {
  try {
    const db = await readData();
    res.status(200).json(db.statistics);
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    res.status(500).end();
  }
};

module.exports = allStatistics;
