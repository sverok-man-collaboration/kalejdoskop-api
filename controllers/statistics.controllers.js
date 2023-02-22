// @ts-nocheck

// Model imports
const { jsonData } = require("../models/db.model");

// Get all statistics method
const allStatistics = async (req, res) => {
  try {
    const db = await jsonData();
    res.status(200).json(db.statistics);
  } catch (error) {
    console.log(error);
    res.status(500).end();
  }
};

module.exports = allStatistics;
