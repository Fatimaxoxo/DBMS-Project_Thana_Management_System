// models/user.model.js
import { pool } from "../config/db.js";

export const UserModel = {
  async create({ name, phone, password, role = "user", thana_id = null }) {
    const [result] = await pool.query(
      "INSERT INTO users (name, phone, password, user_type, thana_id) VALUES (?, ?, ?, ?, ?)",
      [name, phone, password, role, thana_id]
    );
    return {
      user_id: result.insertId,
      name,
      phone,
      user_type: role,
      thana_id,
    };
  },

  async findByPhone(phone) {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.phone, u.password, u.user_type, u.thana_id, u.created_at, t.name as thana_name 
       FROM users u 
       LEFT JOIN Thana t ON u.thana_id = t.thana_id 
       WHERE u.phone = ?`,
      [phone]
    );
    return rows[0];
  },

  async findById(userId) {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.phone, u.user_type, u.thana_id, u.created_at, t.name as thana_name 
       FROM users u 
       LEFT JOIN Thana t ON u.thana_id = t.thana_id 
       WHERE u.user_id = ?`,
      [userId]
    );
    return rows[0];
  },

  async findByRole(role) {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.phone, u.user_type as role, u.thana_id, u.created_at, t.name as thana_name 
       FROM users u 
       LEFT JOIN Thana t ON u.thana_id = t.thana_id 
       WHERE u.user_type = ?`,
      [role]
    );
    return rows;
  },

  async findByThanaAndRole(thanaId, role) {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.name, u.phone, u.user_type as role, u.thana_id, u.created_at, t.name as thana_name 
       FROM users u 
       LEFT JOIN Thana t ON u.thana_id = t.thana_id 
       WHERE u.thana_id = ? AND u.user_type = ?`,
      [thanaId, role]
    );
    return rows;
  },

  async update(userId, updates) {
    // Map 'role' to 'user_type' if it exists in updates
    if (updates.role) {
      updates.user_type = updates.role;
      delete updates.role;
    }

    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    values.push(userId);

    await pool.query(`UPDATE users SET ${fields} WHERE user_id = ?`, values);
    return this.findById(userId);
  },
};
