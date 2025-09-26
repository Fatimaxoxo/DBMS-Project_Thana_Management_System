// scripts/addTestData.js
import { pool } from "../config/db.js";

async function addTestData() {
  try {
    console.log("Adding test data to database...");

    // Insert more sample users
    await pool.query(`
      INSERT IGNORE INTO users (name, phone, password, user_type, thana_id) VALUES
      ('সাকিব আহমেদ', '01788888888', '123456', 'user', NULL),
      ('রহিমা খাতুন', '01799999999', '123456', 'user', NULL),
      ('করিম উদ্দিন', '01700000000', '123456', 'user', NULL),
      ('নাসির হোসেন', '01811111111', '123456', 'thana-officer', 1),
      ('সোহেল রানা', '01822222222', '123456', 'warrant-officer', 1),
      ('আমিনা বেগম', '01833333333', '123456', 'user', NULL)
    `);
    console.log("✅ Additional users inserted");

    // Get user IDs for complaints
    const [users] = await pool.query(`
      SELECT user_id, name, phone FROM users WHERE user_type = 'user' LIMIT 6
    `);

    if (users.length > 0) {
      // Insert sample complaints
      const complaints = [
        {
          user_id: users[0].user_id,
          crime_type: "চুরি",
          description:
            "রাতে ঘরে চোর ঢুকে টাকা-পয়সা ও গহনা চুরি করেছে। আনুমানিক ক্ষতি ৫০,০০০ টাকা।",
          incident_date: "2025-09-20",
          incident_location: "মিরপুর-১০, ঢাকা",
          suspect_info: "পাড়ার কয়েকজন সন্দেহভাজন ব্যক্তি আছে",
        },
        {
          user_id: users[1]?.user_id || users[0].user_id,
          crime_type: "ডাকাতি",
          description:
            "দিনের বেলা দোকানে ডাকাতি হয়েছে। ডাকাতরা অস্ত্র দেখিয়ে টাকা নিয়ে গেছে।",
          incident_date: "2025-09-21",
          incident_location: "ধানমন্ডি, ঢাকা",
          suspect_info: "৩-৪ জন যুবক, মুখ ঢাকা ছিল",
        },
        {
          user_id: users[2]?.user_id || users[0].user_id,
          crime_type: "মারামারি",
          description:
            "পাড়ায় দুই পক্ষের মধ্যে মারামারি হয়েছে। একজন আহত হয়েছে।",
          incident_date: "2025-09-22",
          incident_location: "উত্তরা, ঢাকা",
          suspect_info: "প্রতিবেশী রহিম ও করিমের মধ্যে বিরোধ",
        },
        {
          user_id: users[3]?.user_id || users[0].user_id,
          crime_type: "মাদক",
          description: "এলাকায় মাদক বিক্রি হচ্ছে। যুবকরা নষ্ট হচ্ছে।",
          incident_date: "2025-09-23",
          incident_location: "গুলশান, ঢাকা",
          suspect_info: "স্থানীয় কয়েকজন মাদক বিক্রেতা",
        },
        {
          user_id: users[4]?.user_id || users[0].user_id,
          crime_type: "যৌতুক",
          description: "বিয়ের পর যৌতুকের জন্য নির্যাতন করা হচ্ছে।",
          incident_date: "2025-09-19",
          incident_location: "সাভার, ঢাকা",
          suspect_info: "স্বামী ও শ্বশুরবাড়ির লোকজন",
        },
      ];

      for (const complaint of complaints) {
        try {
          await pool.query(
            `
            INSERT INTO Makes_complaint (
              user_id, crime_type, description, incident_date, location, suspect_info, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())
          `,
            [
              complaint.user_id,
              complaint.crime_type,
              complaint.description,
              complaint.incident_date,
              complaint.incident_location,
              complaint.suspect_info,
            ]
          );
        } catch (error) {
          // If new columns don't exist, try with basic columns
          await pool.query(
            `
            INSERT INTO Makes_complaint (description, status) VALUES (?, 'pending')
          `,
            [complaint.description]
          );
        }
      }
      console.log("✅ Sample complaints inserted");

      // Get complaint IDs for cases
      const [complaints_result] = await pool.query(`
        SELECT complaint_id FROM Makes_complaint LIMIT 3
      `);

      if (complaints_result.length > 0) {
        // Insert sample cases
        const cases = [
          {
            complaint_id: complaints_result[0].complaint_id,
            case_number: "CASE-2025-001",
            status: "pending",
            priority: "high",
          },
          {
            complaint_id:
              complaints_result[1]?.complaint_id ||
              complaints_result[0].complaint_id,
            case_number: "CASE-2025-002",
            status: "in_progress",
            priority: "medium",
          },
          {
            complaint_id:
              complaints_result[2]?.complaint_id ||
              complaints_result[0].complaint_id,
            case_number: "CASE-2025-003",
            status: "completed",
            priority: "low",
          },
        ];

        for (const case_data of cases) {
          try {
            await pool.query(
              `
              INSERT INTO Case_filing (
                complaint_id, case_number, status, priority, progress_percentage, created_at
              ) VALUES (?, ?, ?, ?, ?, NOW())
            `,
              [
                case_data.complaint_id,
                case_data.case_number,
                case_data.status,
                case_data.priority,
                case_data.status === "completed"
                  ? 100
                  : case_data.status === "in_progress"
                  ? 65
                  : 0,
              ]
            );
          } catch (error) {
            // If new columns don't exist, try with basic columns
            await pool.query(
              `
              INSERT INTO Case_filing (complaint_id, status) VALUES (?, ?)
            `,
              [case_data.complaint_id, case_data.status]
            );
          }
        }
        console.log("✅ Sample cases inserted");
      }

      // Insert sample notifications
      const notifications = [
        {
          user_id: users[0].user_id,
          title: "অভিযোগ গৃহীত",
          message: "আপনার চুরির অভিযোগটি গৃহীত হয়েছে এবং তদন্ত শুরু হয়েছে।",
          type: "case",
        },
        {
          user_id: users[1]?.user_id || users[0].user_id,
          title: "মামলা আপডেট",
          message: "আপনার ডাকাতির মামলায় অগ্রগতি হয়েছে। তদন্ত চলমান।",
          type: "progress",
        },
        {
          user_id: users[2]?.user_id || users[0].user_id,
          title: "মামলা সমাধান",
          message: "আপনার মারামারির মামলাটি সমাধান হয়েছে।",
          type: "case",
        },
      ];

      for (const notification of notifications) {
        try {
          await pool.query(
            `
            INSERT INTO notifications (user_id, title, message, type, created_at) 
            VALUES (?, ?, ?, ?, NOW())
          `,
            [
              notification.user_id,
              notification.title,
              notification.message,
              notification.type,
            ]
          );
        } catch (error) {
          console.log("Error inserting notification:", error.message);
        }
      }
      console.log("✅ Sample notifications inserted");
    }

    // Display current data summary
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

    try {
      const [notificationCount] = await pool.query(
        "SELECT COUNT(*) as count FROM notifications"
      );
      console.log(`🔔 মোট বিজ্ঞপ্তি: ${notificationCount[0].count}`);
    } catch (error) {
      console.log("🔔 বিজ্ঞপ্তি টেবিল পাওয়া যায়নি");
    }

    console.log("\n🔑 টেস্ট একাউন্ট:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📱 নাম্বার: 01766666666, পাসওয়ার্ড: 123456 (সাধারণ ইউজার)");
    console.log("📱 নাম্বার: 01722222222, পাসওয়ার্ড: 123456 (থানা অফিসার)");
    console.log(
      "📱 নাম্বার: 01733333333, পাসওয়ার্ড: 123456 (ওয়ারেন্ট অফিসার)"
    );
    console.log(
      "📱 নাম্বার: 01788888888, পাসওয়ার্ড: 123456 (সাকিব আহমেদ - ইউজার)"
    );
  } catch (error) {
    console.error("❌ টেস্ট ডাটা যোগ করতে সমস্যা:", error);
  } finally {
    process.exit(0);
  }
}

addTestData();
