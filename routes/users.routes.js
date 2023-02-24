const express = require("express");
const router = express.Router();

// Controller imports
const {
  allUsers,
  postUser,
  deleteUser,
} = require("../controllers/users.controllers");

// Get all users route
router.get("/", allUsers);

// Post user route
router.post("/", postUser);

// Delete user route
router.delete("/", deleteUser);

module.exports = router;
