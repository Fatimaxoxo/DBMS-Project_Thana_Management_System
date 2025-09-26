// scripts/checkSchema.js
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "ahmedalimran83@",
  database: "thana_management",
});

async function checkSchema() {
  console.log("🔍 Checking Users Table Schema...\n");

  try {
    // Check users table structure
    const [columns] = await connection.promise().query("DESCRIBE users");

    console.log("📋 Users Table Columns:");
    columns.forEach((col) => {
      console.log(
        `   ${col.Field}: ${col.Type} ${
          col.Key === "PRI" ? "(PRIMARY KEY)" : ""
        }`
      );
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    connection.end();
  }
}

checkSchema();
