// scripts/checkComplaintsTable.js
import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "ahmedalimran83@",
  database: "thana_management",
});

async function checkComplaintsTable() {
  console.log("🔍 Checking Complaints Table Structure...\n");

  try {
    // Check complaints table structure
    const [structure] = await connection.promise().query("DESCRIBE complaints");

    console.log("📋 Complaints Table Columns:");
    structure.forEach((column) => {
      console.log(
        `   ${column.Field}: ${column.Type} ${
          column.Key === "PRI" ? "(PRIMARY KEY)" : ""
        } ${column.Extra}`
      );
    });

    // Check cases table structure
    console.log("\n📋 Cases Table Columns:");
    const [casesStructure] = await connection.promise().query("DESCRIBE cases");

    casesStructure.forEach((column) => {
      console.log(
        `   ${column.Field}: ${column.Type} ${
          column.Key === "PRI" ? "(PRIMARY KEY)" : ""
        } ${column.Extra}`
      );
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    connection.end();
  }
}

checkComplaintsTable();
