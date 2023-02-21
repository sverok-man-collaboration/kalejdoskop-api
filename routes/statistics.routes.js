// @ts-nocheck
const express = require("express");
const router = express.Router();

// Controller imports
const allStatistics = require("../controllers/statistics.controllers");

// Get all statistics
router.get("/", allStatistics);

module.exports = router;
