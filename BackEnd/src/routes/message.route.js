import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar } from "../controller/message.controller.js";

const router = express.Router();

router.get(`/users`, protectedRoute, getUsersForSidebar);

export default router;