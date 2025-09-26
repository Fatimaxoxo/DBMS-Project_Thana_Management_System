import { pool } from "../config/db.js";

export const CaseModel = {
  async findAll({
    page = 1,
    limit = 20,
    status,
    thana_id,
    assigned_to,
    user_id,
  }) {
    const offset = (page - 1) * limit;
    const params = [];
    let sql = `SELECT c.*, 
               comp.description AS complaint_description,
               comp.complaint_type AS crime_type,
               comp.location AS incident_location,
               comp.created_at AS complaint_date,
               wo.name AS warrant_officer_name, 
               u.name AS user_name,
               u.phone AS user_phone,
               u.email AS user_email,
               t.name AS thana_name, 
               c.progress_percentage
               FROM cases c
               LEFT JOIN complaints comp ON c.complaint_id = comp.complaint_id
               LEFT JOIN users wo ON c.assigned_warrant_officer_id = wo.user_id
               LEFT JOIN users u ON c.user_id = u.user_id
               LEFT JOIN Thana t ON c.thana_id = t.thana_id`;

    const where = [];
    if (status) {
      where.push("c.status = ?");
      params.push(status);
    }
    if (thana_id) {
      where.push("c.thana_id = ?");
      params.push(thana_id);
    }
    if (assigned_to) {
      where.push("c.assigned_warrant_officer_id = ?");
      params.push(assigned_to);
    }
    if (user_id) {
      where.push("c.user_id = ?");
      params.push(user_id);
    }

    if (where.length) sql += " WHERE " + where.join(" AND ");
    sql += " ORDER BY c.created_at DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT c.*, 
               comp.description AS complaint_description,
               comp.complaint_type AS crime_type,
               comp.location AS incident_location,
               comp.created_at AS complaint_date,
               wo.name AS warrant_officer_name, 
               u.name AS user_name,
               u.phone AS user_phone,
               u.email AS user_email,
               t.name AS thana_name, 
               c.progress_percentage
       FROM cases c
       LEFT JOIN complaints comp ON c.complaint_id = comp.complaint_id
       LEFT JOIN users wo ON c.assigned_warrant_officer_id = wo.user_id
       LEFT JOIN users u ON c.user_id = u.user_id
       LEFT JOIN Thana t ON c.thana_id = t.thana_id
       WHERE c.case_id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async create({
    case_number,
    complaint_id,
    user_id,
    case_title,
    case_description,
    case_type = "criminal",
    crime_type,
    status = "pending",
    priority = "medium",
    incident_location,
    incident_date,
    thana_id,
  }) {
    const [result] = await pool.query(
      `INSERT INTO cases (case_number, complaint_id, user_id, case_title, case_description, case_type, crime_type, status, priority, incident_location, incident_date, thana_id, progress_percentage)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        case_number,
        complaint_id,
        user_id,
        case_title,
        case_description,
        case_type,
        crime_type,
        status,
        priority,
        incident_location,
        incident_date,
        thana_id,
      ]
    );
    return await this.findById(result.insertId);
  },

  async assignWarrantOfficer(
    caseId,
    warrantOfficerId,
    thanaOfficerId,
    notes = ""
  ) {
    await pool.query(
      `UPDATE cases SET assigned_warrant_officer_id = ?, assigned_by_thana_officer_id = ?, assignment_notes = ?, status = 'assigned' WHERE case_id = ?`,
      [warrantOfficerId, thanaOfficerId, notes, caseId]
    );
    return await this.findById(caseId);
  },

  async updateProgress(caseId, progressPercentage, notes = null) {
    let status = "investigating";
    if (progressPercentage >= 100) {
      status = "resolved";
    } else if (progressPercentage > 0) {
      status = "investigating";
    }

    await pool.query(
      `UPDATE cases SET progress_percentage = ?, status = ? WHERE case_id = ?`,
      [progressPercentage, status, caseId]
    );
    return await this.findById(caseId);
  },

  async update(id, updates) {
    const fields = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = Object.values(updates);
    values.push(id);

    await pool.query(`UPDATE cases SET ${fields} WHERE case_id = ?`, values);
    return await this.findById(id);
  },

  async remove(id) {
    const [r] = await pool.query("DELETE FROM cases WHERE case_id = ?", [id]);
    return r.affectedRows > 0;
  },
};
