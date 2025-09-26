// scripts/simpleAddTestData.js
import { pool } from "../config/db.js";

async function simpleAddTestData() {
  try {
    console.log("🔄 Simple test data add করছি...\n");

    // Manually add complaints with existing IDs
    const complaintsToAdd = [
      {
        complaint_id: 16,
        user_id: 4, // রহিম উদ্দিন
        crime_type: "মোবাইল চুরি",
        description:
          "বাস স্টপে দাঁড়িয়ে থাকার সময় পকেট থেকে মোবাইল ফোন চুরি হয়েছে।",
        location: "শান্তিনগর বাস স্টপ",
        incident_date: "2025-09-22",
        suspect_info: "প্রায় ২৫ বছর বয়সী একজন যুবক, নীল রঙের শার্ট পরা ছিল।",
        thana_id: 1,
      },
      {
        complaint_id: 17,
        user_id: 5, // সালমা আক্তার
        crime_type: "বাড়িতে চুরি",
        description:
          "বাড়ি থেকে বের হওয়ার সময় দরজা খোলা রেখে গেছি। ফিরে এসে দেখি টাকা ও গহনা চুরি হয়েছে।",
        location: "মিরপুর ১, বাসা নং ২৫/এ",
        incident_date: "2025-09-23",
        suspect_info: "পাশের বাড়ির কাজের লোক সন্দেহজনক আচরণ করছিল।",
        thana_id: 1,
      },
      {
        complaint_id: 18,
        user_id: 10, // রাশিদা বেগম
        crime_type: "ইভটিজিং",
        description:
          "অফিস থেকে ফেরার পথে প্রতিদিন কিছু যুবক উত্যক্ত করে। অশ্লীল মন্তব্য করে।",
        location: "গুলশান ২ নম্বর সড়ক",
        incident_date: "2025-09-21",
        suspect_info:
          "স্থানীয় ৩-৪ জন যুবক, সাধারণত বিকেলে ওই এলাকায় দেখা যায়।",
        thana_id: 1,
      },
    ];

    const casesToAdd = [
      {
        case_id: 16,
        case_number: "CASE-2025-016",
        summary: "মোবাইল চুরি সংক্রান্ত মামলা - শান্তিনগর বাস স্টপ",
        complaint_id: 16,
        user_id: 4,
        thana_id: 1,
        priority: "medium",
        status: "pending",
      },
      {
        case_id: 17,
        case_number: "CASE-2025-017",
        summary: "বাড়িতে চুরি সংক্রান্ত মামলা - মিরপুর ১",
        complaint_id: 17,
        user_id: 5,
        thana_id: 1,
        priority: "medium",
        status: "pending",
      },
      {
        case_id: 18,
        case_number: "CASE-2025-018",
        summary: "ইভটিজিং সংক্রান্ত মামলা - গুলশান ২",
        complaint_id: 18,
        user_id: 10,
        thana_id: 1,
        priority: "high",
        status: "pending",
      },
    ];

    // Add complaints
    for (const complaint of complaintsToAdd) {
      try {
        await pool.query(
          `
          INSERT INTO Makes_complaint 
          (complaint_id, user_id, crime_type, description, location, incident_date, suspect_info, thana_id, status, date, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURDATE(), NOW())
        `,
          [
            complaint.complaint_id,
            complaint.user_id,
            complaint.crime_type,
            complaint.description,
            complaint.location,
            complaint.incident_date,
            complaint.suspect_info,
            complaint.thana_id,
          ]
        );
        console.log(`✅ Complaint added: ${complaint.crime_type}`);
      } catch (error) {
        console.log(
          `⚠️ Complaint ${complaint.complaint_id} might already exist`
        );
      }
    }

    // Add cases
    for (const case_ of casesToAdd) {
      try {
        await pool.query(
          `
          INSERT INTO Case_filing 
          (case_id, case_number, summary, start_date, complaint_id, user_id, thana_id, priority, status, progress_percentage, created_at)
          VALUES (?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, 0, NOW())
        `,
          [
            case_.case_id,
            case_.case_number,
            case_.summary,
            case_.complaint_id,
            case_.user_id,
            case_.thana_id,
            case_.priority,
            case_.status,
          ]
        );
        console.log(`✅ Case added: ${case_.case_number}`);
      } catch (error) {
        console.log(`⚠️ Case ${case_.case_id} might already exist`);
      }
    }

    // Add notifications
    const notifications = [
      {
        user_id: 21, // Thana officer
        title: "নতুন অভিযোগসমূহ",
        message: "৩টি নতুন অভিযোগ এসেছে যা তদন্তের অপেক্ষায় রয়েছে।",
        type: "complaint_received",
      },
      {
        user_id: 27, // Another Thana officer
        title: "নতুন অভিযোগসমূহ",
        message: "৩টি নতুন অভিযোগ এসেছে যা তদন্তের অপেক্ষায় রয়েছে।",
        type: "complaint_received",
      },
    ];

    for (const notif of notifications) {
      try {
        await pool.query(
          `
          INSERT INTO notifications 
          (user_id, title, message, type, created_at)
          VALUES (?, ?, ?, ?, NOW())
        `,
          [notif.user_id, notif.title, notif.message, notif.type]
        );
      } catch (error) {
        console.log(
          `⚠️ Notification for user ${notif.user_id} might already exist`
        );
      }
    }

    // Show final summary
    const [totalComplaints] = await pool.query(
      "SELECT COUNT(*) as count FROM Makes_complaint"
    );
    const [totalCases] = await pool.query(
      "SELECT COUNT(*) as count FROM Case_filing"
    );
    const [totalNotifications] = await pool.query(
      "SELECT COUNT(*) as count FROM notifications"
    );

    console.log(`\n📊 Database Summary:`);
    console.log(`📝 Total Complaints: ${totalComplaints[0].count}`);
    console.log(`📁 Total Cases: ${totalCases[0].count}`);
    console.log(`🔔 Total Notifications: ${totalNotifications[0].count}`);

    console.log("\n🎉 Test data সফলভাবে যোগ করা হয়েছে!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    process.exit(0);
  }
}

simpleAddTestData();
