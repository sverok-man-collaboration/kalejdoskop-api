import { Router } from "express";

// Controller imports
import { emailAuth, verifyUser } from "../controllers/login.controllers.mjs";

const router = Router();

// Login with email route
router.post("/", emailAuth);

// Verify user route
router.get("/verify", verifyUser);

export default router;
