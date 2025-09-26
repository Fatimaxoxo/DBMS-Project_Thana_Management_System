import { pool } from "../config/db.js";

export const ThanaModel = {
  async findAll({ page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query(
      "SELECT thana_id, name, address, contact FROM Thana ORDER BY thana_id LIMIT ? OFFSET ?",
      [Number(limit), Number(offset)]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query("SELECT * FROM Thana WHERE thana_id = ?", [
      id,
    ]);
    return rows[0] || null;
  },

  async create({ thana_id, name, address, contact }) {
    await pool.query(
      "INSERT INTO Thana (thana_id, name, address, contact) VALUES (?, ?, ?, ?)",
      [thana_id, name, address, contact]
    );
    return await this.findById(thana_id);
  },

  async update(id, { name, address, contact }) {
    await pool.query(
      "UPDATE Thana SET name = ?, address = ?, contact = ? WHERE thana_id = ?",
      [name, address, contact, id]
    );
    return await this.findById(id);
  },

  async remove(id) {
    const [r] = await pool.query("DELETE FROM Thana WHERE thana_id = ?", [id]);
    return r.affectedRows > 0;
  },
};
