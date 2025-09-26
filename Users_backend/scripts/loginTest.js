// scripts/loginTest.js
import https from "https";
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

async function testThanaOfficerLogin() {
  console.log("🔑 Testing Thana Officer Login...\n");

  try {
    const response = await makeRequest(
      "POST",
      "http://localhost:4000/api/auth/login",
      {
        phone: "01711000001",
        password: "123456",
      }
    );

    if (response.status === 200) {
      console.log("✅ Login Successful!");
      console.log("Response Data:", JSON.stringify(response.data, null, 2));

      // Extract user data for frontend testing
      const userData = response.data.user;
      console.log("\n📋 User Data for Frontend:");
      console.log(`Name: ${userData.name}`);
      console.log(`Phone: ${userData.phone}`);
      console.log(`User Type: ${userData.userType}`);
      console.log(`User ID: ${userData.user_id}`);
      console.log(`Thana Name: ${userData.thana_name}`);

      return userData;
    } else {
      console.error("❌ Login Failed!");
      console.error("Status:", response.status);
      console.error("Response:", response.data);
      return null;
    }
  } catch (error) {
    console.error("❌ Login Failed!");
    console.error("Network Error:", error.message);
    return null;
  }
}

testThanaOfficerLogin();
