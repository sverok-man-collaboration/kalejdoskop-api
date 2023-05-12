import { Router } from "express";

// Controller imports
import {
  allStatistics,
  postStatistics,
} from "../controllers/statistics.controllers.mjs";

const router = Router();

// Get all statistics route
router.get("/", allStatistics);

// Post statistics route
router.post("/", postStatistics);

export default router;
