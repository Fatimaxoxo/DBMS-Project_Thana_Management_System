// scripts/assignTestCase.js
import { pool } from "../config/db.js";

async function assignTestCase() {
  try {
    console.log("🔄 Test case assign করছি...\n");

    // Warrant officer খুঁজি
    const [warrantOfficers] = await pool.query(`
      SELECT user_id, name 
      FROM users 
      WHERE user_type = 'warrant-officer' 
      LIMIT 1
    `);

    if (warrantOfficers.length === 0) {
      console.log("❌ কোনো warrant officer পাওয়া যায়নি");
      return;
    }

    const warrantOfficer = warrantOfficers[0];
    console.log(
      `👮 Warrant Officer: ${warrantOfficer.name} (ID: ${warrantOfficer.user_id})`
    );

    // Available case খুঁজি
    const [availableCases] = await pool.query(`
      SELECT case_id, case_number, summary, status 
      FROM Case_filing 
      WHERE assigned_to IS NULL 
      OR assigned_to = ''
      LIMIT 3
    `);

    console.log(`📋 Available cases: ${availableCases.length}\n`);

    if (availableCases.length === 0) {
      console.log("❌ কোনো available case নেই");
      return;
    }

    // First case assign করি
    const caseToAssign = availableCases[0];

    await pool.query(
      `
      UPDATE Case_filing 
      SET assigned_to = ?, status = 'in_progress'
      WHERE case_id = ?
    `,
      [warrantOfficer.user_id, caseToAssign.case_id]
    );

    console.log(`✅ Case assigned successfully:`);
    console.log(`   Case ID: ${caseToAssign.case_id}`);
    console.log(`   Case Number: ${caseToAssign.case_number}`);
    console.log(`   Summary: ${caseToAssign.summary}`);
    console.log(`   Assigned to: ${warrantOfficer.name}`);

    // Notification তৈরি করি
    await pool.query(
      `
      INSERT INTO notifications (user_id, title, message, type, case_id, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `,
      [
        warrantOfficer.user_id,
        "নতুন কেস বরাদ্দ",
        `আপনাকে একটি নতুন মামলা বরাদ্দ করা হয়েছে: ${
          caseToAssign.case_number || `CASE-${caseToAssign.case_id}`
        }`,
        "assignment",
        caseToAssign.case_id,
      ]
    );

    console.log(`📩 Notification sent to warrant officer\n`);

    console.log("🎉 Test case assignment সম্পন্ন!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    process.exit(0);
  }
}

assignTestCase();
