// scripts/createCasesTable.js
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "ahmedalimran83@",
  database: "thana_management",
});

async function createCasesTable() {
  console.log("🏗️  Creating Cases Table...\n");

  try {
    // Drop existing cases table if exists
    await connection.promise().query("DROP TABLE IF EXISTS cases");

    // Create cases table
    const createCasesQuery = `
      CREATE TABLE cases (
        case_id INT PRIMARY KEY AUTO_INCREMENT,
        case_number VARCHAR(50) UNIQUE NOT NULL,
        complaint_id INT NOT NULL,
        user_id INT NOT NULL,
        case_title VARCHAR(255) NOT NULL,
        case_description TEXT NOT NULL,
        case_type ENUM('criminal', 'civil', 'administrative') DEFAULT 'criminal',
        crime_type VARCHAR(100) NOT NULL,
        status ENUM('pending', 'assigned', 'investigating', 'resolved', 'closed') DEFAULT 'pending',
        priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
        progress_percentage INT DEFAULT 0,
        incident_location VARCHAR(255),
        incident_date DATETIME,
        assigned_warrant_officer_id INT NULL,
        assigned_by_thana_officer_id INT NULL,
        assignment_notes TEXT,
        thana_id INT NOT NULL,
        evidence_files JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_warrant_officer_id) REFERENCES users(user_id) ON DELETE SET NULL,
        FOREIGN KEY (assigned_by_thana_officer_id) REFERENCES users(user_id) ON DELETE SET NULL,
        FOREIGN KEY (thana_id) REFERENCES Thana(thana_id) ON DELETE CASCADE
      )
    `;

    await connection.promise().query(createCasesQuery);
    console.log("✅ Cases table created successfully!");

    // Create notifications table for real-time notifications
    await connection.promise().query("DROP TABLE IF EXISTS notifications");

    const createNotificationsQuery = `
      CREATE TABLE notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        recipient_user_id INT NOT NULL,
        recipient_role ENUM('user', 'thana-officer', 'warrant-officer') NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('new_case', 'case_assigned', 'progress_update', 'case_resolved') NOT NULL,
        case_id INT NULL,
        complaint_id INT NULL,
        read_status BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (recipient_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
        FOREIGN KEY (case_id) REFERENCES cases(case_id) ON DELETE CASCADE,
        FOREIGN KEY (complaint_id) REFERENCES complaints(complaint_id) ON DELETE CASCADE
      )
    `;

    await connection.promise().query(createNotificationsQuery);
    console.log("✅ Notifications table created successfully!");

    // Update complaints table to remove case-related fields (since we have separate cases table)
    await connection.promise().query(`
      ALTER TABLE complaints 
      MODIFY status ENUM('pending', 'processed') DEFAULT 'pending'
    `);
    console.log("✅ Complaints table updated!");

    console.log("\n🎉 Database structure ready for complaint → case workflow!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    connection.end();
  }
}

createCasesTable();
