// routes/auth.routes.js
import express from "express";
import { signup, login, getProfile } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authenticateToken, getProfile);

export default router;
