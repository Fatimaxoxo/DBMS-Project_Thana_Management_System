// scripts/updateUserTypes.js
import { pool } from "../config/db.js";

async function updateUserTypes() {
  try {
    // Update the user_type enum to include new roles
    await pool.query(`
      ALTER TABLE users MODIFY user_type 
      ENUM('victim','complaint_officer','warrant_officer','thana_head','user','thana-officer','warrant-officer') 
      DEFAULT 'user'
    `);
    console.log("User types updated successfully!");

    // Insert sample users with new role system
    await pool.query(`
      INSERT IGNORE INTO users (name, phone, password, user_type, thana_id) VALUES
      ('Dhaka Thana Officer', '01722222222', '123456', 'thana-officer', 1),
      ('Warrant Officer Ahmed', '01733333333', '123456', 'warrant-officer', 1),
      ('Chittagong Thana Officer', '01744444444', '123456', 'thana-officer', 2),
      ('Warrant Officer Rahman', '01755555555', '123456', 'warrant-officer', 2)
    `);
    console.log("Officer users inserted successfully!");

    // Update existing users to use 'user' role
    await pool.query(
      `UPDATE users SET user_type = 'user' WHERE user_type = 'victim'`
    );
    console.log("Updated existing users to 'user' role");
  } catch (error) {
    console.error("Error updating user types:", error.message);
  } finally {
    pool.end();
    process.exit(0);
  }
}

updateUserTypes();
