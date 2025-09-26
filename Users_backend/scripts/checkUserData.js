// scripts/checkUserData.js
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "ahmedalimran83@",
  database: "thana_management",
});

async function checkUserData() {
  console.log("🔍 Checking User Data for Thana Officer Login...\n");

  try {
    // Check thana officer user
    const [thanaOfficer] = await connection
      .promise()
      .query("SELECT * FROM users WHERE phone = '01711000001'");

    if (thanaOfficer.length > 0) {
      const user = thanaOfficer[0];
      console.log("✅ Thana Officer Found:");
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Phone: ${user.phone}`);
      console.log(`   User Type: ${user.user_type}`);
      console.log(`   Thana Name: ${user.thana_name || "Not Set"}`);
      console.log(`   Created: ${user.created_at}`);
    } else {
      console.log("❌ Thana Officer not found!");
    }

    console.log("\n" + "=".repeat(50));

    // Check all users with thana-officer type
    const [allOfficers] = await connection
      .promise()
      .query("SELECT * FROM users WHERE user_type = 'thana-officer'");

    console.log(`\n📊 Total Thana Officers: ${allOfficers.length}`);
    allOfficers.forEach((officer, index) => {
      console.log(`${index + 1}. ${officer.name} (${officer.phone})`);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    connection.end();
  }
}

checkUserData();
