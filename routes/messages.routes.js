const express = require("express");
const router = express.Router();

// Controller imports
const {
  getAnswers1,
  postAnswer1,
  patchAnswer1,
  deleteAnswer1,
} = require("../controllers/messages.controllers");

// Get answers to question 1 route
router.get("/1", getAnswers1);

// Post answer to question 1 route
router.post("/1", postAnswer1);

// Patch answer to question 1 route
router.patch("/1", patchAnswer1);

// Delete answer to question 1 route
router.delete("/1", deleteAnswer1);

module.exports = router;
