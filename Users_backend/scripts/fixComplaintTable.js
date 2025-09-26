// scripts/fixComplaintTable.js
import { pool } from "../config/db.js";

async function fixComplaintTable() {
  try {
    console.log("🔧 Complaint table fix করছি...\n");

    // Fix complaint_id to auto increment
    await pool.query(`
      ALTER TABLE Makes_complaint 
      MODIFY complaint_id INT AUTO_INCREMENT
    `);
    console.log("✅ complaint_id auto increment সেট করা হয়েছে");

    // Get max complaint_id and set auto increment value
    const [maxId] = await pool.query(
      "SELECT MAX(complaint_id) as max_id FROM Makes_complaint"
    );
    const nextId = (maxId[0].max_id || 0) + 1;

    await pool.query(`ALTER TABLE Makes_complaint AUTO_INCREMENT = ${nextId}`);
    console.log(`✅ Auto increment value set to ${nextId}`);

    console.log("\n🎉 Complaint table fix সম্পন্ন!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    process.exit(0);
  }
}

fixComplaintTable();
