import { pool } from "../config/db.js";

export const CaseModel = {
  async findAll({ page = 1, limit = 20, status }) {
    const offset = (page - 1) * limit;
    const params = [];
    let sql = `SELECT cf.*, mc.description AS complaint_description, o.name AS officer_name, t.name AS thana_name
               FROM Case_filing cf
               LEFT JOIN Makes_complaint mc ON cf.complaint_id = mc.complaint_id
               LEFT JOIN Officer o ON cf.officer_id = o.officer_id
               LEFT JOIN Thana t ON cf.thana_id = t.thana_id`;
    if (status) {
      sql += " WHERE cf.status = ?";
      params.push(status);
    }
    sql += " ORDER BY cf.start_date DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT cf.*, mc.description AS complaint_description, o.name AS officer_name, t.name AS thana_name
       FROM Case_filing cf
       LEFT JOIN Makes_complaint mc ON cf.complaint_id = mc.complaint_id
       LEFT JOIN Officer o ON cf.officer_id = o.officer_id
       LEFT JOIN Thana t ON cf.thana_id = t.thana_id
       WHERE cf.case_id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create({
    case_id,
    summary,
    status,
    start_date,
    end_date,
    complaint_id,
    officer_id,
    thana_id,
  }) {
    await pool.query(
      `INSERT INTO Case_filing (case_id, summary, status, start_date, end_date, complaint_id, officer_id, thana_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        case_id,
        summary,
        status,
        start_date,
        end_date,
        complaint_id,
        officer_id,
        thana_id,
      ]
    );
    return await this.findById(case_id);
  },

  async update(
    id,
    {
      summary,
      status,
      start_date,
      end_date,
      complaint_id,
      officer_id,
      thana_id,
    }
  ) {
    await pool.query(
      `UPDATE Case_filing SET summary=?, status=?, start_date=?, end_date=?, complaint_id=?, officer_id=?, thana_id=?
       WHERE case_id=?`,
      [
        summary,
        status,
        start_date,
        end_date,
        complaint_id,
        officer_id,
        thana_id,
        id,
      ]
    );
    return await this.findById(id);
  },

  async remove(id) {
    const [r] = await pool.query("DELETE FROM Case_filing WHERE case_id = ?", [
      id,
    ]);
    return r.affectedRows > 0;
  },
};
