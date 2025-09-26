// scripts/addTestUsers.js
import { pool } from "../config/db.js";

async function addTestUsers() {
  try {
    console.log("Adding test users with correct roles...");

    const testUsers = [
      {
        name: "সাকিব আহমেদ",
        phone: "01788888888",
        password: "123456",
        user_type: "user",
      },
      {
        name: "রহিমা খাতুন",
        phone: "01799999999",
        password: "123456",
        user_type: "user",
      },
      {
        name: "নাসির হোসেন (থানা অফিসার)",
        phone: "01711000001",
        password: "123456",
        user_type: "thana-officer",
      },
      {
        name: "সোহেল রানা (ওয়ারেন্ট অফিসার)",
        phone: "01711000002",
        password: "123456",
        user_type: "warrant-officer",
      },
    ];

    for (const user of testUsers) {
      try {
        await pool.query(
          `
          INSERT IGNORE INTO users (name, phone, password, user_type, thana_id) 
          VALUES (?, ?, ?, ?, 1)
        `,
          [user.name, user.phone, user.password, user.user_type]
        );

        console.log(
          `✅ User added: ${user.name} (${user.phone}) - ${user.user_type}`
        );
      } catch (error) {
        console.log(`Error adding user ${user.name}:`, error.message);
      }
    }

    // Show all users with proper roles
    console.log("\n👥 সকল ইউজার (ভূমিকা অনুযায়ী):");
    const [users] = await pool.query(`
      SELECT name, phone, user_type, thana_id 
      FROM users 
      WHERE user_type IN ('user', 'thana-officer', 'warrant-officer')
      ORDER BY user_type, name
    `);
    console.table(users);

    console.log("\n🔑 লগইন এর জন্য টেস্ট অ্যাকাউন্ট:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("👤 সাধারণ ইউজার:");
    console.log("   📱 01788888888 | 🔑 123456 (সাকিব আহমেদ)");
    console.log("   📱 01799999999 | 🔑 123456 (রহিমা খাতুন)");
    console.log("\n👮 থানা অফিসার:");
    console.log("   📱 01711000001 | 🔑 123456 (নাসির হোসেন)");
    console.log("\n🔍 ওয়ারেন্ট অফিসার:");
    console.log("   📱 01711000002 | 🔑 123456 (সোহেল রানা)");
  } catch (error) {
    console.error("❌ টেস্ট ইউজার যোগ করতে সমস্যা:", error);
  } finally {
    process.exit(0);
  }
}

addTestUsers();
