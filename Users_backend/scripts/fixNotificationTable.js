// scripts/fixNotificationTable.js
import { pool } from "../config/db.js";

async function fixNotificationTable() {
  try {
    console.log("Fixing notification table structure...");

    // Add missing columns
    const columnsToAdd = [
      { name: "case_id", definition: "INT NULL" },
      { name: "complaint_id", definition: "INT NULL" },
    ];

    for (const column of columnsToAdd) {
      try {
        await pool.query(`
          ALTER TABLE notifications ADD COLUMN ${column.name} ${column.definition}
        `);
        console.log(`✅ Added ${column.name} column`);
      } catch (error) {
        if (error.code === "ER_DUP_FIELDNAME") {
          console.log(`${column.name} column already exists`);
        } else {
          console.log(`Error adding ${column.name}:`, error.message);
        }
      }
    }

    // Update enum values for type column
    try {
      await pool.query(`
        ALTER TABLE notifications MODIFY COLUMN type 
        ENUM('info', 'case', 'assignment', 'progress', 'urgent', 'complaint', 'update') 
        DEFAULT 'info'
      `);
      console.log("✅ Updated type enum values");
    } catch (error) {
      console.log("Error updating type enum:", error.message);
    }

    // Show updated structure
    const [structure] = await pool.query("DESCRIBE notifications");
    console.log("\n📋 Updated notifications table structure:");
    console.table(structure);

    console.log("✅ Notification table fixed!");
  } catch (error) {
    console.error("❌ Error fixing notification table:", error);
  } finally {
    process.exit(0);
  }
}

fixNotificationTable();
