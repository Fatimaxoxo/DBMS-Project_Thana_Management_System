// scripts/showDatabaseSummary.js
import { pool } from "../config/db.js";

async function showDatabaseSummary() {
  try {
    console.log("🗄️ ডাটাবেস সারাংশ প্রতিবেদন");
    console.log("═══════════════════════════════════════");

    // Show all users
    console.log("\n👥 সকল ইউজার:");
    const [allUsers] = await pool.query(`
      SELECT user_id, name, phone, user_type, thana_id
      FROM users 
      ORDER BY user_type, user_id
    `);
    console.table(allUsers);

    // Show all complaints
    console.log("\n📝 সকল অভিযোগ:");
    const [allComplaints] = await pool.query(`
      SELECT 
        c.complaint_id,
        c.user_id,
        u.name as complainant_name,
        c.crime_type,
        c.description,
        c.location,
        c.status,
        c.created_at
      FROM Makes_complaint c 
      LEFT JOIN users u ON c.user_id = u.user_id 
      ORDER BY c.complaint_id DESC
      LIMIT 10
    `);
    console.table(allComplaints);

    // Show all cases
    console.log("\n📁 সকল মামলা:");
    const [allCases] = await pool.query(`
      SELECT 
        cf.case_id,
        cf.complaint_id,
        cf.status,
        c.crime_type,
        u.name as complainant_name
      FROM Case_filing cf
      LEFT JOIN Makes_complaint c ON cf.complaint_id = c.complaint_id
      LEFT JOIN users u ON c.user_id = u.user_id
      ORDER BY cf.case_id DESC
      LIMIT 10
    `);
    console.table(allCases);

    // Count by role
    console.log("\n📊 ভূমিকা অনুযায়ী সংখ্যা:");
    const [roleCounts] = await pool.query(`
      SELECT user_type, COUNT(*) as count
      FROM users 
      GROUP BY user_type
    `);
    console.table(roleCounts);

    // Show login credentials
    console.log("\n🔑 টেস্ট লগইন তথ্য:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const [testAccounts] = await pool.query(`
      SELECT name, phone, user_type
      FROM users 
      WHERE phone IN ('01788888888', '01799999999', '01711000001', '01711000002', '01766666666', '01722222222', '01733333333')
      ORDER BY user_type
    `);

    testAccounts.forEach((account) => {
      const role =
        account.user_type === "user"
          ? "👤 ইউজার"
          : account.user_type === "thana-officer"
          ? "👮 থানা অফিসার"
          : account.user_type === "warrant-officer"
          ? "🔍 ওয়ারেন্ট অফিসার"
          : account.user_type;
      console.log(
        `${role}: ${account.name || "নাম নেই"} - 📱 ${
          account.phone
        } - 🔑 123456`
      );
    });

    console.log("\n✅ সিস্টেম প্রস্তুত!");
    console.log("🌐 http://localhost:3000 এ গিয়ে টেস্ট করুন");
  } catch (error) {
    console.error("❌ ডাটাবেস তথ্য দেখাতে সমস্যা:", error);
  } finally {
    process.exit(0);
  }
}

showDatabaseSummary();
