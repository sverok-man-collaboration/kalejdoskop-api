// @ts-nocheck
const express = require("express");
const router = express.Router();

// Controller imports
const {
  allStatistics,
  postStatistics,
} = require("../controllers/statistics.controllers");

// Get all statistics
router.get("/", allStatistics);

// Post statistics to question 1
router.post("/1", postStatistics);

module.exports = router;
