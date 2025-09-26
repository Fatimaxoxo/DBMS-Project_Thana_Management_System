import { pool } from "../config/db.js";

export const HandoverModel = {
  async findAll({ page = 1, limit = 20, case_id }) {
    const offset = (page - 1) * limit;
    const params = [];
    let sql = `SELECT chl.*, o.name AS officer_name
               FROM Case_handover_log chl
               LEFT JOIN Officer o ON chl.officer_id = o.officer_id`;
    if (case_id) {
      sql += " WHERE chl.case_id = ?";
      params.push(case_id);
    }
    sql += " ORDER BY chl.date DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM Case_handover_log WHERE log_id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async create({ log_id, case_id, date, officer_id, remarks }) {
    await pool.query(
      `INSERT INTO Case_handover_log (log_id, case_id, date, officer_id, remarks)
       VALUES (?, ?, ?, ?, ?)`,
      [log_id, case_id, date, officer_id, remarks]
    );
    return await this.findById(log_id);
  },

  async update(id, { case_id, date, officer_id, remarks }) {
    await pool.query(
      `UPDATE Case_handover_log SET case_id=?, date=?, officer_id=?, remarks=? WHERE log_id=?`,
      [case_id, date, officer_id, remarks, id]
    );
    return await this.findById(id);
  },

  async remove(id) {
    const [r] = await pool.query(
      "DELETE FROM Case_handover_log WHERE log_id = ?",
      [id]
    );
    return r.affectedRows > 0;
  },
};
