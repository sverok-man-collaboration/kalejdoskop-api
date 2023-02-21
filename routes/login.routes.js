// @ts-nocheck
const express = require("express");
const router = express.Router();

// Controller imports
const { emailAuth, verifyUser } = require("../controllers/login.controllers");

// Login request
router.post("/", emailAuth);

// Verify user
router.get("/verify", verifyUser);

module.exports = router;
