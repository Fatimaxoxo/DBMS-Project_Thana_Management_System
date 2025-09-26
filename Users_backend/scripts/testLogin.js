// scripts/testLogin.js
import { pool } from "../config/db.js";

async function testLogin() {
  try {
    console.log("🔄 Login test করছি...\n");

    const phone = "01711000001";
    const password = "123456";

    // Check user in database
    const [users] = await pool.query(
      `
      SELECT u.user_id, u.name, u.phone, u.password, u.user_type, u.thana_id, t.name as thana_name
      FROM users u 
      LEFT JOIN Thana t ON u.thana_id = t.thana_id 
      WHERE u.phone = ?
    `,
      [phone]
    );

    if (users.length === 0) {
      console.log("❌ User not found with phone:", phone);
      return;
    }

    const user = users[0];
    console.log("✅ User found:");
    console.table(user);

    // Check password
    if (user.password !== password) {
      console.log(
        `❌ Password mismatch. Expected: ${password}, Got: ${user.password}`
      );
      return;
    }

    console.log("✅ Password matches");

    // Test API call
    console.log("\n🌐 Testing API call...");

    const response = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: phone,
        password: password,
      }),
    });

    const result = await response.json();
    console.log("📡 API Response:");
    console.log(JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log("✅ Login API successful!");

      // Test role check
      console.log(
        `\n🔍 Role check: ${result.user.userType || result.user.role}`
      );
      if (
        result.user.userType === "thana-officer" ||
        result.user.role === "thana-officer"
      ) {
        console.log("✅ Thana officer role confirmed");
      } else {
        console.log("❌ Role mismatch for thana officer");
      }
    } else {
      console.log("❌ Login API failed:", result.message);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    process.exit(0);
  }
}

testLogin();
