import { Router } from "express";

// Controller imports
import {
  allMessages,
  getMessage,
  postMessage,
  threeRandomMessages,
  patchMessage,
} from "../controllers/messages.controllers.mjs";

const router = Router();

// Get all messages route
router.get("/", allMessages);

// Get three random messages route
router.get("/three-random-messages", threeRandomMessages);

// Get message route
router.get("/:id", getMessage);

// Post message route
router.post("/", postMessage);

// Patch answer to question 1 route
router.patch("/", patchMessage);

export default router;
