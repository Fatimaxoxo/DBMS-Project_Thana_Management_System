import { pool } from "../config/db.js";

export const OfficerModel = {
  async findAll({ page = 1, limit = 20, thana_id }) {
    const offset = (page - 1) * limit;
    const params = [];
    let sql = "SELECT * FROM Officer";
    if (thana_id) {
      sql += " WHERE thana_id = ?";
      params.push(thana_id);
    }
    sql += " ORDER BY officer_id LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM Officer WHERE officer_id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async create({
    officer_id,
    name,
    grade,
    email,
    phone,
    thana_id,
    division_office,
  }) {
    await pool.query(
      "INSERT INTO Officer (officer_id, name, grade, email, phone, thana_id, division_office) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [officer_id, name, grade, email, phone, thana_id, division_office]
    );
    return await this.findById(officer_id);
  },

  async update(id, { name, grade, email, phone, thana_id, division_office }) {
    await pool.query(
      "UPDATE Officer SET name=?, grade=?, email=?, phone=?, thana_id=?, division_office=? WHERE officer_id=?",
      [name, grade, email, phone, thana_id, division_office, id]
    );
    return await this.findById(id);
  },

  async remove(id) {
    const [r] = await pool.query("DELETE FROM Officer WHERE officer_id = ?", [
      id,
    ]);
    return r.affectedRows > 0;
  },
};
