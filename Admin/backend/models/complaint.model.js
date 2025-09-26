import { pool } from "../config/db.js";

export const ComplaintModel = {
  async findAll({ page = 1, limit = 20, thana_id, status }) {
    const offset = (page - 1) * limit;
    const params = [];
    let sql = `SELECT mc.*, v.name AS victim_name, cd.name AS crime_name, cd.crime_type
               FROM Makes_complaint mc
               LEFT JOIN Victim v ON mc.victim_id = v.victim_id
               LEFT JOIN Crime_detection cd ON mc.crime_id = cd.crime_id`;
    const where = [];
    if (thana_id) {
      where.push("mc.thana_id = ?");
      params.push(thana_id);
    }
    if (status) {
      where.push("mc.status = ?");
      params.push(status);
    }
    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY mc.date DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT mc.*, v.name AS victim_name, cd.name AS crime_name, cd.crime_type
       FROM Makes_complaint mc
       LEFT JOIN Victim v ON mc.victim_id = v.victim_id
       LEFT JOIN Crime_detection cd ON mc.crime_id = cd.crime_id
       WHERE mc.complaint_id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create({
    complaint_id,
    description,
    date,
    acknowledgment_id,
    status,
    victim_id,
    thana_id,
    crime_id,
  }) {
    await pool.query(
      `INSERT INTO Makes_complaint (complaint_id, description, date, acknowledgment_id, status, victim_id, thana_id, crime_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        complaint_id,
        description,
        date,
        acknowledgment_id,
        status,
        victim_id,
        thana_id,
        crime_id,
      ]
    );
    return await this.findById(complaint_id);
  },

  async update(
    id,
    {
      description,
      date,
      acknowledgment_id,
      status,
      victim_id,
      thana_id,
      crime_id,
    }
  ) {
    await pool.query(
      `UPDATE Makes_complaint SET description=?, date=?, acknowledgment_id=?, status=?, victim_id=?, thana_id=?, crime_id=?
       WHERE complaint_id=?`,
      [
        description,
        date,
        acknowledgment_id,
        status,
        victim_id,
        thana_id,
        crime_id,
        id,
      ]
    );
    return await this.findById(id);
  },

  async remove(id) {
    const [r] = await pool.query(
      "DELETE FROM Makes_complaint WHERE complaint_id = ?",
      [id]
    );
    return r.affectedRows > 0;
  },
};
