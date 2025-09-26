// scripts/addMoreComplaints.js
import { pool } from "../config/db.js";

async function addMoreComplaints() {
  try {
    console.log("Adding more complaints with proper user linkage...");

    // Get user IDs
    const [users] = await pool.query(`
      SELECT user_id, name, phone FROM users 
      WHERE user_type = 'user' AND phone IN ('01788888888', '01799999999')
    `);

    console.log("Found users:", users);

    if (users.length > 0) {
      const moreComplaints = [
        {
          id: 10,
          user_id: users[0].user_id,
          crime_type: "সাইবার অপরাধ",
          description:
            "অনলাইনে ভুয়া পণ্য বিক্রির ফাঁদে পড়ে ৫০,০০০ টাকা হারিয়েছি। টাকা ফেরত দিতে অস্বীকার করছে।",
          location: "অনলাইন প্রতারণা",
          incident_date: "2025-09-23",
          status: "pending",
        },
        {
          id: 11,
          user_id: users[1]?.user_id || users[0].user_id,
          crime_type: "উত্যক্তকরণ",
          description:
            "অফিসে যাওয়ার পথে প্রতিদিন উত্যক্ত করা হচ্ছে। নিরাপত্তার অভাব অনুভব করছি।",
          location: "মিরপুর-১২, ঢাকা",
          incident_date: "2025-09-22",
          status: "pending",
        },
        {
          id: 12,
          user_id: users[0].user_id,
          crime_type: "জালিয়াতি",
          description:
            "ব্যাংক একাউন্ট থেকে অজানা ব্যক্তি টাকা তুলে নিয়েছে। কার্ডের তথ্য চুরি হয়েছে।",
          location: "এটিএম বুথ, গুলশান",
          incident_date: "2025-09-21",
          status: "under_investigation",
        },
      ];

      for (const complaint of moreComplaints) {
        try {
          await pool.query(
            `
            INSERT INTO Makes_complaint (
              complaint_id, user_id, crime_type, description, location, 
              incident_date, status, date, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE 
            crime_type = VALUES(crime_type),
            description = VALUES(description),
            location = VALUES(location),
            status = VALUES(status)
          `,
            [
              complaint.id,
              complaint.user_id,
              complaint.crime_type,
              complaint.description,
              complaint.location,
              complaint.incident_date,
              complaint.status,
              complaint.incident_date,
            ]
          );

          console.log(
            `✅ Complaint ${complaint.id} added: ${complaint.crime_type}`
          );
        } catch (error) {
          console.log(`Error adding complaint ${complaint.id}:`, error.message);
        }
      }

      // Add corresponding cases
      const newCases = [
        { id: 10, complaint_id: 10, status: "pending" },
        { id: 11, complaint_id: 11, status: "pending" },
        { id: 12, complaint_id: 12, status: "in_progress" },
      ];

      for (const case_ of newCases) {
        try {
          await pool.query(
            `
            INSERT INTO Case_filing (case_id, complaint_id, status) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE status = VALUES(status)
          `,
            [case_.id, case_.complaint_id, case_.status]
          );

          console.log(`✅ Case ${case_.id} added`);
        } catch (error) {
          console.log(`Error adding case ${case_.id}:`, error.message);
        }
      }
    }

    // Show updated summary
    console.log("\n📊 আপডেটেড ডাটাবেস সারাংশ:");

    const [complaintCount] = await pool.query(
      "SELECT COUNT(*) as count FROM Makes_complaint"
    );
    console.log(`📝 মোট অভিযোগ: ${complaintCount[0].count}`);

    const [caseCount] = await pool.query(
      "SELECT COUNT(*) as count FROM Case_filing"
    );
    console.log(`📁 মোট মামলা: ${caseCount[0].count}`);

    // Show user-specific complaints
    console.log("\n📋 ইউজার অনুযায়ী অভিযোগ:");
    const [userComplaints] = await pool.query(`
      SELECT 
        u.name as complainant,
        u.phone,
        c.crime_type,
        c.status,
        c.created_at
      FROM Makes_complaint c 
      LEFT JOIN users u ON c.user_id = u.user_id 
      WHERE u.user_type = 'user'
      AND c.crime_type IS NOT NULL
      ORDER BY c.created_at DESC
      LIMIT 10
    `);
    console.table(userComplaints);

    console.log("\n✅ আরো টেস্ট ডাটা যোগ করা হয়েছে!");
    console.log("🌐 এখন সিস্টেমে লগইন করে টেস্ট করুন");
  } catch (error) {
    console.error("❌ অভিযোগ যোগ করতে সমস্যা:", error);
  } finally {
    process.exit(0);
  }
}

addMoreComplaints();
