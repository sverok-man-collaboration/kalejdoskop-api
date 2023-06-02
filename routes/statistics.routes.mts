import { Router } from "express";

// Controller imports
import {
  getAllStatisticsController,
  postStatisticController,
  getAllDownloadStatisticsController,
  postDownloadStatisticsController,
} from "../controllers/statistics.controllers.mjs";

const router = Router();

// Get all statistics route
router.get("/", getAllStatisticsController);

// Post statistics route
router.post("/", postStatisticController);

// Get all download statistics route
router.get("/downloads", getAllDownloadStatisticsController);

// Post download statistics route
router.post("/downloads", postDownloadStatisticsController);

export default router;
