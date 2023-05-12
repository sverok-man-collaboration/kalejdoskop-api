import { Router } from "express";

// Middlewares imports
import { verifyToken } from "../middlewares/authenticate-token.mjs";

// Controller imports
import {
  allMessages,
  retrieveMessage,
  postMessage,
  threeRandomMessages,
  patchMessage,
} from "../controllers/messages.controllers.mjs";

const router = Router();

// Get all messages route
router.get("/", verifyToken, allMessages);

// Get three random messages route
router.get("/three-random/:room/:object", threeRandomMessages);

// Get message route
router.get("/:id", verifyToken, retrieveMessage);

// Post message route
router.post("/", postMessage);

// Patch message route
router.patch("/", verifyToken, patchMessage);

export default router;
