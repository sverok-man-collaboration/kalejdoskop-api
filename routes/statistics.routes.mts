import { Router } from "express";

// Controller imports
import {
  allStatistics,
  postStatistics,
} from "../controllers/statistics.controllers.mjs";

const router = Router();

// Get all statistics route
router.get("/", allStatistics);

// Post statistics to question 1 route
router.post("/1", postStatistics);

export default router;