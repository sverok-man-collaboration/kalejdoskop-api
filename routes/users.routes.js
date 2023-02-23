// @ts-nocheck
const express = require("express");
const router = express.Router();

// Controller imports
const {
  allUsers,
  postUser,
  deleteUser,
} = require("../controllers/users.controllers");

// Get all users request
router.get("/", allUsers);

// Post user request
router.post("/", postUser);

// Delete user request
router.delete("/", deleteUser);

module.exports = router;
