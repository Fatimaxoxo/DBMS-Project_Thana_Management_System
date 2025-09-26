// controllers/notification.controller.js
import { NotificationModel } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const userId = req.params.userId;
  const offset = (page - 1) * limit;

  const notifications = await NotificationModel.findByUserId(userId, {
    limit,
    offset,
  });
  const unreadCount = await NotificationModel.getUnreadCount(userId);

  res.json({
    notifications,
    unreadCount,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      offset,
    },
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;
  await NotificationModel.markAsRead(notificationId);
  res.json({ message: "Notification marked as read" });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  await NotificationModel.markAllAsRead(userId);
  res.json({ message: "All notifications marked as read" });
});

export const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const count = await NotificationModel.getUnreadCount(userId);
  res.json({ unreadCount: count });
});

export const getCurrentUserNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const userId = req.user.userId;
  const offset = (page - 1) * limit;

  const notifications = await NotificationModel.findByUserId(userId, {
    limit: parseInt(limit),
    offset: parseInt(offset),
  });
  const unreadCount = await NotificationModel.getUnreadCount(userId);

  res.json({
    notifications,
    unreadCount,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      offset,
    },
  });
});
