// routes/notification.routes.js
import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getCurrentUserNotifications,
} from "../controllers/notification.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get current user's notifications
router.get("/", getCurrentUserNotifications);
router.get("/:userId", getNotifications);
router.put("/:id/read", markAsRead);
router.put("/:userId/read-all", markAllAsRead);
router.get("/:userId/unread-count", getUnreadCount);

export default router;
