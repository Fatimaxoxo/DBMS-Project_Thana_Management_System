import { pool } from "../config/db.js";

export const VictimModel = {
  async findAll({ page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      "SELECT victim_id, name, nid, address, phone FROM Victim ORDER BY victim_id DESC LIMIT ? OFFSET ?",
      [Number(limit), Number(offset)]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM Victim WHERE victim_id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async create({ victim_id, name, nid, address, phone }) {
    const [result] = await pool.query(
      "INSERT INTO Victim (victim_id, name, nid, address, phone) VALUES (?, ?, ?, ?, ?)",
      [victim_id, name, nid, address, phone]
    );
    return await this.findById(victim_id);
  },

  async update(id, { name, nid, address, phone }) {
    await pool.query(
      "UPDATE Victim SET name = ?, nid = ?, address = ?, phone = ? WHERE victim_id = ?",
      [name, nid, address, phone, id]
    );
    return await this.findById(id);
  },

  async remove(id) {
    const [r] = await pool.query("DELETE FROM Victim WHERE victim_id = ?", [
      id,
    ]);
    return r.affectedRows > 0;
  },
};
