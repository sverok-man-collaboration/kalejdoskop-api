import { Router } from "express";

// Middlewares imports
import verifyToken from "../middlewares/authenticate-token.mjs";

// Controller imports
import {
  getAllMessagesController,
  postMessageController,
  getThreeRandomMessagesController,
  patchMessageController,
} from "../controllers/messages.controllers.mjs";

const router = Router();

// Get all messages route
router.get("/", verifyToken, getAllMessagesController);

// Get three random messages route
router.get("/three-random/:room/:object", getThreeRandomMessagesController);

// Post message route
router.post("/", postMessageController);

// Patch message route
router.patch("/", verifyToken, patchMessageController);

export default router;
