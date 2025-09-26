import { pool } from "../config/db.js";

export const ComplaintModel = {
  async findAll({ page = 1, limit = 20, thana_id, status }) {
    const offset = (page - 1) * limit;
    const params = [];
    let sql = `SELECT c.*, u.name AS complainant_name, u.phone AS complainant_phone,
               t.name AS thana_name
               FROM complaints c
               LEFT JOIN users u ON c.user_id = u.user_id
               LEFT JOIN Thana t ON c.thana_id = t.thana_id`;
    const where = [];
    if (thana_id) {
      where.push("c.thana_id = ?");
      params.push(thana_id);
    }
    if (status) {
      where.push("c.status = ?");
      params.push(status);
    }
    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY c.created_at DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT c.*, u.name AS complainant_name, u.phone AS complainant_phone,
              t.name AS thana_name
       FROM complaints c
       LEFT JOIN users u ON c.user_id = u.user_id
       LEFT JOIN Thana t ON c.thana_id = t.thana_id
       WHERE c.complaint_id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create({
    title,
    description,
    complaint_type,
    location,
    incident_date,
    user_id,
    thana_id,
    status = "pending",
  }) {
    const [result] = await pool.query(
      `INSERT INTO complaints (title, description, complaint_type, location, incident_date, user_id, thana_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        complaint_type,
        location,
        incident_date,
        user_id,
        thana_id,
        status,
      ]
    );
    return {
      complaint_id: result.insertId,
      title,
      description,
      complaint_type,
      location,
      incident_date,
      user_id,
      thana_id,
      status,
    };
  },

  async update(id, updates) {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    values.push(id);

    await pool.query(
      `UPDATE complaints SET ${fields} WHERE complaint_id = ?`,
      values
    );
    return await this.findById(id);
  },

  async remove(id) {
    const [r] = await pool.query(
      "DELETE FROM complaints WHERE complaint_id = ?",
      [id]
    );
    return r.affectedRows > 0;
  },
};
