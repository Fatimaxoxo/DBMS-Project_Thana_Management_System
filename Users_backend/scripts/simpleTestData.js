// scripts/simpleTestData.js
import { pool } from "../config/db.js";

async function addSimpleTestData() {
  try {
    console.log("Adding simple test data...");

    // Add sample complaints with manual IDs
    const complaints = [
      {
        id: 1,
        description:
          "রাতে ঘরে চোর ঢুকে টাকা-পয়সা ও গহনা চুরি করেছে। আনুমানিক ক্ষতি ৫০,০০০ টাকা।",
        crime_type: "চুরি",
        location: "মিরপুর-১০, ঢাকা",
        status: "pending",
        user_id: 1,
      },
      {
        id: 2,
        description:
          "দিনের বেলা দোকানে ডাকাতি হয়েছে। ডাকাতরা অস্ত্র দেখিয়ে টাকা নিয়ে গেছে।",
        crime_type: "ডাকাতি",
        location: "ধানমন্ডি, ঢাকা",
        status: "pending",
        user_id: 2,
      },
      {
        id: 3,
        description:
          "পাড়ায় দুই পক্ষের মধ্যে মারামারি হয়েছে। একজন আহত হয়েছে।",
        crime_type: "মারামারি",
        location: "উত্তরা, ঢাকা",
        status: "resolved",
        user_id: 3,
      },
    ];

    for (const complaint of complaints) {
      try {
        await pool.query(
          `
          INSERT INTO Makes_complaint (complaint_id, description, crime_type, location, status, user_id, date, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, CURDATE(), NOW())
          ON DUPLICATE KEY UPDATE 
          description = VALUES(description),
          crime_type = VALUES(crime_type),
          location = VALUES(location),
          status = VALUES(status)
        `,
          [
            complaint.id,
            complaint.description,
            complaint.crime_type,
            complaint.location,
            complaint.status,
            complaint.user_id,
          ]
        );

        console.log(`✅ Complaint ${complaint.id} inserted`);
      } catch (error) {
        console.log(
          `Error inserting complaint ${complaint.id}:`,
          error.message
        );
      }
    }

    // Add sample cases
    const cases = [
      {
        id: 1,
        complaint_id: 1,
        status: "pending",
      },
      {
        id: 2,
        complaint_id: 2,
        status: "in_progress",
      },
    ];

    for (const case_ of cases) {
      try {
        await pool.query(
          `
          INSERT INTO Case_filing (case_id, complaint_id, status) 
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE 
          status = VALUES(status)
        `,
          [case_.id, case_.complaint_id, case_.status]
        );

        console.log(`✅ Case ${case_.id} inserted`);
      } catch (error) {
        console.log(`Error inserting case ${case_.id}:`, error.message);
      }
    }

    // Show summary
    console.log("\n📊 ডাটাবেস সারাংশ:");

    const [userCount] = await pool.query("SELECT COUNT(*) as count FROM users");
    console.log(`👥 মোট ইউজার: ${userCount[0].count}`);

    const [complaintCount] = await pool.query(
      "SELECT COUNT(*) as count FROM Makes_complaint"
    );
    console.log(`📝 মোট অভিযোগ: ${complaintCount[0].count}`);

    const [caseCount] = await pool.query(
      "SELECT COUNT(*) as count FROM Case_filing"
    );
    console.log(`📁 মোট মামলা: ${caseCount[0].count}`);

    // Show test users
    console.log("\n🔑 টেস্ট একাউন্ট:");
    const [testUsers] = await pool.query(
      "SELECT name, phone, user_type FROM users LIMIT 8"
    );
    console.table(testUsers);

    // Show sample complaints
    console.log("\n📝 নমুনা অভিযোগসমূহ:");
    const [sampleComplaints] = await pool.query(`
      SELECT c.complaint_id, c.crime_type, c.location, c.status, u.name as complainant 
      FROM Makes_complaint c 
      LEFT JOIN users u ON c.user_id = u.user_id 
      LIMIT 5
    `);
    console.table(sampleComplaints);

    console.log("\n✅ টেস্ট ডাটা সফলভাবে যোগ করা হয়েছে!");
    console.log("🌐 এখন http://localhost:3000 এ গিয়ে টেস্ট করুন");
  } catch (error) {
    console.error("❌ টেস্ট ডাটা যোগ করতে সমস্যা:", error);
  } finally {
    process.exit(0);
  }
}

addSimpleTestData();
