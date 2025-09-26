// models/user.model.js
import { pool } from "../config/db.js";

export const UserModel = {
  async create({ name, phone, password }) {
    const [result] = await pool.query(
      "INSERT INTO users (name, phone, password) VALUES (?, ?, ?)",
      [name, phone, password]
    );
    return { id: result.insertId, name, phone };
  },

  async findByPhone(phone) {
    const [rows] = await pool.query("SELECT * FROM users WHERE phone = ?", [
      phone,
    ]);
    return rows[0];
  },
};
