import { Router } from "express";

// Controller imports
import {
  getAllUsersController,
  postUserController,
  deleteUserController,
} from "../controllers/users.controllers.mjs";

const router = Router();

// Get all users route
router.get("/", getAllUsersController);

// Post user route
router.post("/", postUserController);

// Delete user route
router.delete("/:id", deleteUserController);

export default router;
