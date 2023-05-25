import { Router } from "express";

// Controller imports
import { emailAuth } from "../controllers/login.controllers.mjs";

const router = Router();

// Login with email route
router.post("/auth", emailAuth);

export default router;
