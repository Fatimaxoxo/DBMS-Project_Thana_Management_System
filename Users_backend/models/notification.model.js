// models/notification.model.js
import { pool } from "../config/db.js";

export const NotificationModel = {
  async create({
    recipient_user_id,
    recipient_role,
    title,
    message,
    type = "info",
    case_id = null,
    complaint_id = null,
  }) {
    const [result] = await pool.query(
      `INSERT INTO notifications (recipient_user_id, recipient_role, title, message, type, case_id, complaint_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        recipient_user_id,
        recipient_role,
        title,
        message,
        type,
        case_id,
        complaint_id,
      ]
    );
    return {
      id: result.insertId,
      recipient_user_id,
      recipient_role,
      title,
      message,
      type,
      case_id,
      complaint_id,
      read_status: false,
    };
  },

  async findByUserId(userId, { limit = 20, offset = 0 }) {
    const [rows] = await pool.query(
      `SELECT n.*, c.case_number, comp.description as complaint_desc
       FROM notifications n
       LEFT JOIN cases c ON n.case_id = c.case_id
       LEFT JOIN complaints comp ON n.complaint_id = comp.complaint_id
       WHERE n.recipient_user_id = ? 
       ORDER BY n.created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, Number(limit), Number(offset)]
    );
    return rows;
  },

  async markAsRead(notificationId) {
    await pool.query(
      "UPDATE notifications SET read_status = true WHERE id = ?",
      [notificationId]
    );
    return true;
  },

  async markAllAsRead(userId) {
    await pool.query(
      "UPDATE notifications SET read_status = true WHERE recipient_user_id = ?",
      [userId]
    );
    return true;
  },

  async getUnreadCount(userId) {
    const [rows] = await pool.query(
      "SELECT COUNT(*) as count FROM notifications WHERE recipient_user_id = ? AND read_status = false",
      [userId]
    );
    return rows[0].count;
  },

  async notifyThanaOfficers(
    thanaId,
    title,
    message,
    caseId = null,
    complaintId = null
  ) {
    // Get all thana officers for the specific thana
    const [officers] = await pool.query(
      "SELECT user_id FROM users WHERE user_type = 'thana-officer' AND thana_id = ?",
      [thanaId]
    );

    const notifications = [];
    for (const officer of officers) {
      const notification = await this.create({
        recipient_user_id: officer.user_id,
        recipient_role: "thana-officer",
        title,
        message,
        type: "new_case",
        case_id: caseId,
        complaint_id: complaintId,
      });
      notifications.push(notification);
    }
    return notifications;
  },

  async notifyWarrantOfficer(officerId, title, message, caseId = null) {
    return await this.create({
      recipient_user_id: officerId,
      recipient_role: "warrant-officer",
      title,
      message,
      type: "case_assigned",
      case_id: caseId,
    });
  },
};
