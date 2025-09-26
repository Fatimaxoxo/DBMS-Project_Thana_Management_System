// scripts/initDatabase.js
import { pool } from "../config/db.js";

async function initializeDatabase() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(11) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'thana-officer', 'warrant-officer') DEFAULT 'user',
        thana_id INT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_phone (phone),
        INDEX idx_role (role),
        INDEX idx_thana_role (thana_id, role)
      )
    `);

    // Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        notification_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('info', 'case', 'assignment', 'progress', 'urgent') DEFAULT 'info',
        case_id INT NULL,
        complaint_id INT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user_id (user_id),
        INDEX idx_is_read (is_read),
        INDEX idx_type (type),
        INDEX idx_created_at (created_at),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);

    // Add columns to existing tables
    const complaintsColumns = [
      { name: "user_id", definition: "INT" },
      { name: "crime_type", definition: "VARCHAR(100)" },
      { name: "location", definition: "TEXT" },
      { name: "incident_date", definition: "DATE" },
      { name: "created_at", definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ];

    for (const column of complaintsColumns) {
      try {
        await pool.query(
          `ALTER TABLE Makes_complaint ADD COLUMN ${column.name} ${column.definition}`
        );
        console.log(`Added ${column.name} to Makes_complaint`);
      } catch (error) {
        if (error.code === "ER_DUP_FIELDNAME") {
          console.log(
            `Column ${column.name} already exists in Makes_complaint`
          );
        } else {
          console.log(
            `Error adding ${column.name} to Makes_complaint:`,
            error.message
          );
        }
      }
    }

    const casesColumns = [
      { name: "case_number", definition: "VARCHAR(50) UNIQUE" },
      { name: "user_id", definition: "INT" },
      { name: "assigned_to", definition: "INT NULL" },
      { name: "progress_percentage", definition: "INT DEFAULT 0" },
      { name: "progress_notes", definition: "TEXT NULL" },
      {
        name: "priority",
        definition: "ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium'",
      },
      { name: "assigned_at", definition: "TIMESTAMP NULL" },
      { name: "created_at", definition: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP" },
    ];

    for (const column of casesColumns) {
      try {
        await pool.query(
          `ALTER TABLE Case_filing ADD COLUMN ${column.name} ${column.definition}`
        );
        console.log(`Added ${column.name} to Case_filing`);
      } catch (error) {
        if (error.code === "ER_DUP_FIELDNAME") {
          console.log(`Column ${column.name} already exists in Case_filing`);
        } else {
          console.log(
            `Error adding ${column.name} to Case_filing:`,
            error.message
          );
        }
      }
    }

    // Insert sample users
    try {
      await pool.query(`
        INSERT IGNORE INTO users (name, phone, password, role, thana_id) VALUES
        ('Admin User', '01711111111', '123456', 'user', NULL),
        ('Dhaka Thana Officer', '01722222222', '123456', 'thana-officer', 1),
        ('Warrant Officer Ahmed', '01733333333', '123456', 'warrant-officer', 1),
        ('Chittagong Thana Officer', '01744444444', '123456', 'thana-officer', 2),
        ('Warrant Officer Rahman', '01755555555', '123456', 'warrant-officer', 2),
        ('Regular User Karim', '01766666666', '123456', 'user', NULL),
        ('Regular User Fatima', '01777777777', '123456', 'user', NULL)
      `);
      console.log("Sample users inserted successfully!");
    } catch (error) {
      console.log(
        "Error inserting sample users - trying without role column:",
        error.message
      );
      // Try inserting without role if it doesn't exist
      try {
        await pool.query(`
          INSERT IGNORE INTO users (name, phone, password) VALUES
          ('Admin User', '01711111111', '123456'),
          ('Regular User Karim', '01766666666', '123456'),
          ('Regular User Fatima', '01777777777', '123456')
        `);
        console.log("Basic users inserted successfully!");
      } catch (error2) {
        console.log("Error inserting basic users:", error2.message);
      }
    }

    console.log("Database initialized successfully!");
    console.log("Sample users created:");
    console.log("- User: 01766666666 / 123456");
    console.log("- Thana Officer: 01722222222 / 123456");
    console.log("- Warrant Officer: 01733333333 / 123456");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    process.exit(0);
  }
}

initializeDatabase();
