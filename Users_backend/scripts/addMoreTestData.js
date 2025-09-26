// scripts/addMoreTestData.js
import { pool } from "../config/db.js";

async function addMoreTestData() {
  try {
    console.log("🔄 আরো test data add করছি...\n");

    // Add more complaints with proper fields
    const complaintsData = [
      {
        user_id: 4, // রহিম উদ্দিন
        crime_type: "মোবাইল চুরি",
        description:
          "বাস স্টপে দাঁড়িয়ে থাকার সময় পকেট থেকে মোবাইল ফোন চুরি হয়েছে।",
        incident_location: "শান্তিনগর বাস স্টপ",
        incident_date: "2025-09-22",
        suspect_info: "প্রায় ২৫ বছর বয়সী একজন যুবক, নীল রঙের শার্ট পরা ছিল।",
        thana_id: 1,
      },
      {
        user_id: 5, // সালমা আক্তার
        crime_type: "বাড়িতে চুরি",
        description:
          "বাড়ি থেকে বের হওয়ার সময় দরজা খোলা রেখে গেছি। ফিরে এসে দেখি টাকা ও গহনা চুরি হয়েছে।",
        incident_location: "মিরপুর ১, বাসা নং ২৫/এ",
        incident_date: "2025-09-23",
        suspect_info: "পাশের বাড়ির কাজের লোক সন্দেহজনক আচরণ করছিল।",
        thana_id: 1,
      },
      {
        user_id: 10, // রাশিদা বেগম
        crime_type: "ইভটিজিং",
        description:
          "অফিস থেকে ফেরার পথে প্রতিদিন কিছু যুবক উত্যক্ত করে। অশ্লীল মন্তব্য করে।",
        incident_location: "গুলশান ২ নম্বর সড়ক",
        incident_date: "2025-09-21",
        suspect_info:
          "স্থানীয় ৩-৪ জন যুবক, সাধারণত বিকেলে ওই এলাকায় দেখা যায়।",
        thana_id: 1,
      },
    ];

    // Get next complaint_id
    const [maxComplaintId] = await pool.query(
      "SELECT MAX(complaint_id) as max_id FROM Makes_complaint"
    );
    let nextComplaintId = (maxComplaintId[0].max_id || 0) + 1;

    for (const complaint of complaintsData) {
      const [result] = await pool.query(
        `
        INSERT INTO Makes_complaint 
        (complaint_id, user_id, crime_type, description, location, incident_date, suspect_info, thana_id, status, date, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', CURDATE(), NOW())
      `,
        [
          nextComplaintId,
          complaint.user_id,
          complaint.crime_type,
          complaint.description,
          complaint.incident_location,
          complaint.incident_date,
          complaint.suspect_info,
          complaint.thana_id,
        ]
      );

      // Auto create case for each complaint
      const caseNumber = `CASE-${Date.now()}-${result.insertId}`;
      const priority = complaint.crime_type.includes("চুরি")
        ? "medium"
        : complaint.crime_type.includes("ইভটিজিং")
        ? "high"
        : "low";

      const [caseResult] = await pool.query(
        `
        INSERT INTO Case_filing 
        (case_number, summary, start_date, complaint_id, user_id, thana_id, priority, status, progress_percentage, created_at)
        VALUES (?, ?, CURDATE(), ?, ?, ?, ?, 'pending', 0, NOW())
      `,
        [
          caseNumber,
          `${complaint.crime_type} সংক্রান্ত মামলা - ${complaint.incident_location}`,
          nextComplaintId,
          complaint.user_id,
          complaint.thana_id,
          priority,
        ]
      );

      console.log(
        `✅ Complaint & Case created: ${complaint.crime_type} - ${caseNumber}`
      );
      nextComplaintId++; // Increment for next complaint

      // Create notification for thana officers
      const [thanaOfficers] = await pool.query(
        `
        SELECT user_id FROM users WHERE user_type = 'thana-officer' AND thana_id = ?
      `,
        [complaint.thana_id]
      );

      for (const officer of thanaOfficers) {
        await pool.query(
          `
          INSERT INTO notifications 
          (user_id, title, message, type, case_id, complaint_id, created_at)
          VALUES (?, ?, ?, ?, ?, ?, NOW())
        `,
          [
            officer.user_id,
            "নতুন অভিযোগ ও মামলা",
            `নতুন ${complaint.crime_type} অভিযোগ এবং মামলা ${caseNumber} তৈরি হয়েছে। এলাকা: ${complaint.incident_location}`,
            "complaint_received",
            caseResult.insertId,
            nextComplaintId,
          ]
        );
      }

      // Notify user about complaint received
      await pool.query(
        `
        INSERT INTO notifications 
        (user_id, title, message, type, case_id, complaint_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `,
        [
          complaint.user_id,
          "অভিযোগ গ্রহণ সফল",
          `আপনার ${complaint.crime_type} অভিযোগ সফলভাবে গ্রহণ করা হয়েছে। মামলা নম্বর: ${caseNumber}`,
          "complaint_received",
          caseResult.insertId,
          result.insertId,
        ]
      );
    }

    // Show summary
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

addMoreTestData();
