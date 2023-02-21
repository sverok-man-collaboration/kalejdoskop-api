// @ts-nocheck
const express = require("express");
const router = express.Router();

// Controller imports
const {
  getAnswers1,
  addAnswer1,
} = require("../controllers/questions.controllers");

// Get answers to question 1
router.get("/1", getAnswers1);

// Add answer to question 1
router.post("/1", addAnswer1);

module.exports = router;
