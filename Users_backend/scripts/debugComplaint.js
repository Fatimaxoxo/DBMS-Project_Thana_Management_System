// scripts/debugComplaint.js
import http from "http";

function makeRequest(method, url, data = null, token = null) {
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

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

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

async function debugComplaint() {
  console.log("🔍 Debugging Complaint Crime Type Issue...\n");

  try {
    // Login
    const loginResponse = await makeRequest(
      "POST",
      "http://localhost:4000/api/auth/login",
      {
        phone: "01722222222",
        password: "123456",
      }
    );

    if (loginResponse.status !== 200) {
      console.error("❌ Login failed:", loginResponse.data);
      return;
    }

    const userToken = loginResponse.data.token;
    console.log("✅ Login successful");

    // Test with different complaint data
    console.log("\n🧪 Testing with valid complaint_type...");
    const complaintData = {
      title: "ফ্রড এর ঘটনা",
      description: "আমাকে অনলাইনে টাকা নিয়ে প্রতারণা করা হয়েছে।",
      complaint_type: "fraud", // Valid enum value
      location: "ধানমন্ডি, ঢাকা",
      incident_date: "2025-09-24 10:00:00",
    };

    console.log("Sending data:", JSON.stringify(complaintData, null, 2));

    const response = await makeRequest(
      "POST",
      "http://localhost:4000/api/complaints",
      complaintData,
      userToken
    );

    console.log("Response Status:", response.status);
    if (response.status === 500) {
      console.error("❌ Error:", response.data);
    } else {
      console.log("✅ Success:", JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error("❌ Debug failed:", error.message);
  }
}

debugComplaint();
