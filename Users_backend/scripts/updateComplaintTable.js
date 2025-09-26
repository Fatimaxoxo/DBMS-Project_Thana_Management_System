// scripts/updateComplaintTable.js
import { pool } from "../config/db.js";

async function updateComplaintTable() {
  try {
    console.log("📝 Complaint table update করছি...\n");

    // Check if suspect_info column exists
    const [columns] = await pool.query(`
      SHOW COLUMNS FROM Makes_complaint LIKE 'suspect_info'
    `);

    if (columns.length === 0) {
      // Add suspect_info column
      await pool.query(`
        ALTER TABLE Makes_complaint 
        ADD COLUMN suspect_info TEXT NULL AFTER incident_date
      `);
      console.log("✅ suspect_info column added");
    } else {
      console.log("ℹ️ suspect_info column already exists");
    }

    // Check if complaint_title exists, if not add it
    const [titleColumns] = await pool.query(`
      SHOW COLUMNS FROM Makes_complaint LIKE 'complaint_title'
    `);

    if (titleColumns.length === 0) {
      await pool.query(`
        ALTER TABLE Makes_complaint 
        ADD COLUMN complaint_title VARCHAR(255) NULL AFTER crime_type
      `);
      console.log("✅ complaint_title column added");
    }

    // Update existing complaints with titles if empty
    await pool.query(`
      UPDATE Makes_complaint 
      SET complaint_title = CONCAT(crime_type, ' - ', DATE(created_at))
      WHERE complaint_title IS NULL OR complaint_title = ''
    `);
    console.log("✅ Updated existing complaint titles");

    console.log("\n🎉 Complaint table update সম্পন্ন!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    process.exit(0);
  }
}

updateComplaintTable();
