// scripts/testComplaintSubmission.js
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

async function testComplaintFlow() {
  console.log("🔍 Testing Complaint Submission Flow...\n");

  try {
    // Step 1: Login as regular user
    console.log("1️⃣ Logging in as regular user...");
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
    const userData = loginResponse.data.user;
    console.log("✅ Login successful:", userData.name);

    // Step 2: Submit complaint
    console.log("\n2️⃣ Submitting complaint...");
    const complaintData = {
      title: "চুরির ঘটনা",
      description:
        "আমার বাড়ি থেকে মোবাইল ফোন চুরি হয়ে গেছে। রাত ৩টার দিকে অজ্ঞাত ব্যক্তিরা দরজা ভেঙে ঢুকে চুরি করেছে।",
      complaint_type: "theft",
      location: "মিরপুর ১০, ঢাকা",
      incident_date: "2025-09-24 02:00:00",
    };

    const complaintResponse = await makeRequest(
      "POST",
      "http://localhost:4000/api/complaints",
      complaintData,
      userToken
    );

    console.log("Response Status:", complaintResponse.status);
    console.log(
      "Response Data:",
      JSON.stringify(complaintResponse.data, null, 2)
    );

    if (complaintResponse.status === 201) {
      console.log("✅ Complaint submitted successfully!");
      console.log(
        "📱 Complaint ID:",
        complaintResponse.data.complaint?.complaint_id
      );
      console.log("📁 Case Number:", complaintResponse.data.case?.case_number);
    } else {
      console.error("❌ Complaint submission failed:", complaintResponse.data);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testComplaintFlow();
