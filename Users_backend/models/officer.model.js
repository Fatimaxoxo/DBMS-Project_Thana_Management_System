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

  // Get all warrant officers from users table
  async getAllWarrantOfficers() {
    const [rows] = await pool.query(`
      SELECT user_id, name, phone, thana_id, created_at
      FROM users 
      WHERE user_type = 'warrant-officer'
      ORDER BY name
    `);
    return rows;
  },

  // Get warrant officers by thana
  async getWarrantOfficersByThana(thanaId) {
    const [rows] = await pool.query(
      `
      SELECT user_id, name, phone, thana_id, created_at
      FROM users 
      WHERE user_type = 'warrant-officer' AND thana_id = ?
      ORDER BY name
    `,
      [thanaId]
    );
    return rows;
  },

  // Get all thana officers
  async getAllThanaOfficers() {
    const [rows] = await pool.query(`
      SELECT user_id, name, phone, thana_id, created_at
      FROM users 
      WHERE user_type = 'thana-officer'
      ORDER BY name
    `);
    return rows;
  },

  // Get officer by user ID from users table
  async getByUserId(userId) {
    const [rows] = await pool.query(
      `
      SELECT user_id, name, phone, user_type, thana_id, created_at
      FROM users 
      WHERE user_id = ? AND user_type IN ('thana-officer', 'warrant-officer')
    `,
      [userId]
    );
    return rows[0] || null;
  },

  // Get officers with case statistics
  async getOfficersWithStats() {
    const [rows] = await pool.query(`
      SELECT 
        u.user_id,
        u.name,
        u.phone,
        u.user_type,
        u.thana_id,
        COUNT(cf.case_id) as total_cases,
        COUNT(CASE WHEN cf.status = 'pending' THEN 1 END) as pending_cases,
        COUNT(CASE WHEN cf.status = 'in_progress' THEN 1 END) as ongoing_cases,
        COUNT(CASE WHEN cf.status = 'completed' THEN 1 END) as completed_cases
      FROM users u
      LEFT JOIN Case_filing cf ON u.user_id = cf.assigned_to
      WHERE u.user_type IN ('warrant-officer', 'thana-officer')
      GROUP BY u.user_id, u.name, u.phone, u.user_type, u.thana_id
      ORDER BY u.user_type, u.name
    `);
    return rows;
  },

  // Get available warrant officers (with less workload)
  async getAvailableWarrantOfficers(thanaId = null) {
    let query = `
      SELECT 
        u.user_id,
        u.name,
        u.phone,
        u.thana_id,
        COUNT(cf.case_id) as current_cases
      FROM users u
      LEFT JOIN Case_filing cf ON u.user_id = cf.assigned_to 
        AND cf.status IN ('pending', 'in_progress')
      WHERE u.user_type = 'warrant-officer'
    `;

    let params = [];
    if (thanaId) {
      query += ` AND u.thana_id = ?`;
      params.push(thanaId);
    }

    query += `
      GROUP BY u.user_id, u.name, u.phone, u.thana_id
      HAVING current_cases < 5
      ORDER BY current_cases ASC, u.name
    `;

    const [rows] = await pool.query(query, params);
    return rows;
  },
};
