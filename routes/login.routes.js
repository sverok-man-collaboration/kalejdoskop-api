const express = require("express");
const router = express.Router();

// Controller imports
const { emailAuth, verifyUser } = require("../controllers/login.controllers");

// Login with email route
router.post("/", emailAuth);

// Verify user route
router.get("/verify", verifyUser);

module.exports = router;
