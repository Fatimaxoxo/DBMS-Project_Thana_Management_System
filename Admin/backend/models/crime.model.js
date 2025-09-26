import { pool } from "../config/db.js";

export const CrimeModel = {
  async findAll({ page = 1, limit = 20, thana_id }) {
    const offset = (page - 1) * limit;
    const params = [];
    let sql = `SELECT crime_id, crime_type, suspects, name, description, last_seen_location, photo, date, thana_id
               FROM Crime_detection`;
    if (thana_id) {
      sql += " WHERE thana_id = ?";
      params.push(thana_id);
    }
    sql += " ORDER BY date DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM Crime_detection WHERE crime_id = ?",
      [id]
    );
    return rows[0] || null;
  },

  async create(data) {
    const {
      crime_type,
      suspects,
      name,
      description,
      last_seen_location,
      photo,
      date,
      thana_id,
    } = data;
    const [r] = await pool.query(
      `INSERT INTO Crime_detection (crime_type, suspects, name, description, last_seen_location, photo, date, thana_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        crime_type,
        suspects,
        name,
        description,
        last_seen_location,
        photo,
        date,
        thana_id,
      ]
    );
    return await this.findById(r.insertId);
  },

  async update(id, data) {
    const {
      crime_type,
      suspects,
      name,
      description,
      last_seen_location,
      photo,
      date,
      thana_id,
    } = data;
    await pool.query(
      `UPDATE Crime_detection SET crime_type=?, suspects=?, name=?, description=?, last_seen_location=?, photo=?, date=?, thana_id=?
       WHERE crime_id=?`,
      [
        crime_type,
        suspects,
        name,
        description,
        last_seen_location,
        photo,
        date,
        thana_id,
        id,
      ]
    );
    return await this.findById(id);
  },

  async remove(id) {
    const [r] = await pool.query(
      "DELETE FROM Crime_detection WHERE crime_id = ?",
      [id]
    );
    return r.affectedRows > 0;
  },
};
