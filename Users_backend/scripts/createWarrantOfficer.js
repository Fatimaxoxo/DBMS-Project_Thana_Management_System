import mysql from "mysql2/promise";

async function createWarrantOfficer() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "crime_management",
  });

  try {
    // Check if warrant officer exists
    const [existing] = await connection.execute(
      "SELECT * FROM users WHERE phone = ? AND user_type = ?",
      ["01733000001", "warrant-officer"]
    );

    if (existing.length > 0) {
      console.log("✅ Warrant officer already exists:", existing[0].name);
      return;
    }

    // Create warrant officer
    await connection.execute(
      "INSERT INTO users (name, phone, password, user_type, thana_id) VALUES (?, ?, ?, ?, ?)",
      [
        "সোহেল রানা (ওয়ারেন্ট অফিসার)",
        "01733000001",
        "123456",
        "warrant-officer",
        1,
      ]
    );

    console.log("✅ Warrant officer created successfully!");

    // Show all warrant officers
    const [officers] = await connection.execute(
      'SELECT user_id, name, phone, user_type FROM users WHERE user_type = "warrant-officer"'
    );

    console.log("👮 All warrant officers:");
    officers.forEach((officer) => {
      console.log("  -", officer.name, "(" + officer.phone + ")");
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await connection.end();
  }
}

createWarrantOfficer();
