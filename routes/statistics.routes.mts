import { Router } from "express";

// Controller imports
import {
  getAllStatisticsController,
  postStatisticController,
} from "../controllers/statistics.controllers.mjs";

const router = Router();

// Get all statistics route
router.get("/", getAllStatisticsController);

// Post statistics route
router.post("/", postStatisticController);

export default router;
