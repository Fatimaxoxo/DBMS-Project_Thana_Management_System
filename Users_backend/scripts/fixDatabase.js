// scripts/fixDatabase.js
import { pool } from "../config/db.js";

async function fixDatabase() {
  try {
    console.log("Fixing database structure...");

    try {
      // Check and fix complaint_id auto increment
      await pool.query(`
        ALTER TABLE Makes_complaint MODIFY complaint_id INT AUTO_INCREMENT
      `);
      console.log("✅ Fixed complaint_id auto increment");
    } catch (error) {
      console.log("Complaint_id already configured:", error.message);
    }

    try {
      // Check and fix case_id auto increment
      await pool.query(`
        ALTER TABLE Case_filing MODIFY case_id INT AUTO_INCREMENT
      `);
      console.log("✅ Fixed case_id auto increment");
    } catch (error) {
      console.log("Case_id already configured:", error.message);
    }

    console.log("Database structure fixed!");
  } catch (error) {
    console.error("Error fixing database:", error.message);
  } finally {
    process.exit(0);
  }
}

fixDatabase();
