import { Router } from "express";

// Controller imports
import {
  allUsers,
  postUser,
  deleteUser,
} from "../controllers/users.controllers.mjs";

const router = Router();

// Get all users route
router.get("/", allUsers);

// Post user route
router.post("/", postUser);

// Delete user route
router.delete("/", deleteUser);

export default router;
