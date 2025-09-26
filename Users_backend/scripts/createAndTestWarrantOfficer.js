import http from "http";

function makeRequest(method, url, data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers["Content-Length"] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ data: parsed, status: res.statusCode });
        } catch (e) {
          resolve({ data: body, status: res.statusCode });
        }
      });
    });

    req.on("error", reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function createWarrantOfficer() {
  try {
    console.log("Creating warrant officer...");

    const warrantOfficerData = {
      name: "সোহেল রানা (ওয়ারেন্ট অফিসার)",
      phone: "01733000001",
      password: "123456",
      user_type: "warrant-officer",
      thana_id: 1,
    };

    const response = await makeRequest(
      "POST",
      "http://localhost:4000/api/auth/register",
      warrantOfficerData
    );

    if (response.status === 201) {
      console.log("✅ Warrant officer created successfully!");
      console.log("User:", response.data.user.name);
    } else {
      console.log("ℹ️ Response:", response.status, response.data);
      if (
        response.data.message &&
        response.data.message.includes("already exists")
      ) {
        console.log("✅ Warrant officer already exists");
      }
    }

    // Now try to login
    console.log("\nTesting login...");
    const loginResponse = await makeRequest(
      "POST",
      "http://localhost:4000/api/auth/login",
      {
        phone: "01733000001",
        password: "123456",
      }
    );

    if (loginResponse.status === 200) {
      console.log("✅ Login successful!");
      console.log("User:", loginResponse.data.user.name);
      console.log("Role:", loginResponse.data.user.userType);
    } else {
      console.log("❌ Login failed:", loginResponse.data);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

createWarrantOfficer();
