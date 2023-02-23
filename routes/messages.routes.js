// @ts-nocheck
const express = require("express");
const router = express.Router();

// Controller imports
const {
  getAnswers1,
  postAnswer1,
} = require("../controllers/messages.controllers");

// Get answers to question 1
router.get("/1", getAnswers1);

// Post answer to question 1
router.post("/1", postAnswer1);

module.exports = router;
