// @ts-nocheck

// Model imports
const { jsonData } = require("../models/db.model");

const allStatistics = async (req, res) => {
  try {
    const db = await jsonData();
    res.status(200).json(db.statistics);
  } catch (error) {
    res.status(500).end();
  }
};

module.exports = allStatistics;
