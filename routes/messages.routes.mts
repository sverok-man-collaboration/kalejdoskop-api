import { Router } from "express";

// Controller imports
import {
  getAnswers1,
  postAnswer1,
  patchAnswer1,
  deleteAnswer1,
} from "../controllers/messages.controllers.mjs";

const router = Router();

// Get answers to question 1 route
router.get("/1", getAnswers1);

// Post answer to question 1 route
router.post("/1", postAnswer1);

// Patch answer to question 1 route
router.patch("/1", patchAnswer1);

// Delete answer to question 1 route
router.delete("/1", deleteAnswer1);

export default router;
