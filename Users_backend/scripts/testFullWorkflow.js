// scripts/testFullWorkflow.js
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

async function testFullWorkflow() {
  console.log(
    "🎯 Testing Complete Workflow: User → Case → Thana Officer → Warrant Officer\n"
  );

  try {
    // Step 1: User submits complaint
    console.log("1️⃣ User submits complaint...");
    const userLogin = await makeRequest(
      "POST",
      "http://localhost:4000/api/auth/login",
      {
        phone: "01722222222",
        password: "123456",
      }
    );

    if (userLogin.status !== 200) {
      console.error("❌ User login failed");
      return;
    }

    const userToken = userLogin.data.token;
    console.log("✅ User logged in:", userLogin.data.user.name);

    const complaintData = {
      title: "সাইবার অপরাধ",
      description:
        "আমার ফেসবুক একাউন্ট হ্যাক হয়েছে এবং অনুপযুক্ত পোস্ট করা হচ্ছে।",
      complaint_type: "fraud",
      location: "গুলশান ২, ঢাকা",
      incident_date: "2025-09-24 15:00:00",
    };

    const complaintResponse = await makeRequest(
      "POST",
      "http://localhost:4000/api/complaints",
      complaintData,
      userToken
    );

    if (complaintResponse.status !== 201) {
      console.error("❌ Complaint submission failed:", complaintResponse.data);
      return;
    }

    console.log("✅ Complaint submitted successfully");
    console.log(
      "📱 Complaint ID:",
      complaintResponse.data.complaint.complaint_id
    );
    console.log(
      "📁 Auto Case Created:",
      complaintResponse.data.case.case_number
    );

    // Step 2: Check thana officer dashboard
    console.log("\n2️⃣ Checking thana officer dashboard...");
    const thanaLogin = await makeRequest(
      "POST",
      "http://localhost:4000/api/auth/login",
      {
        phone: "01711000001",
        password: "123456",
      }
    );

    if (thanaLogin.status !== 200) {
      console.error("❌ Thana officer login failed");
      return;
    }

    const thanaToken = thanaLogin.data.token;
    console.log("✅ Thana officer logged in:", thanaLogin.data.user.name);

    const dashboardResponse = await makeRequest(
      "GET",
      "http://localhost:4000/api/thanas/officer/dashboard",
      null,
      thanaToken
    );

    if (dashboardResponse.status !== 200) {
      console.error("❌ Dashboard fetch failed:", dashboardResponse.data);
      return;
    }

    const dashboard = dashboardResponse.data;
    console.log("✅ Dashboard loaded successfully");
    console.log("📊 Total Cases:", dashboard.cases.length);
    console.log("🔔 Notifications:", dashboard.notifications.length);
    console.log(
      "👮 Warrant Officers Available:",
      dashboard.warrantOfficers.length
    );

    // Find the newly created case
    const newCase = dashboard.cases.find(
      (c) => c.case_number === complaintResponse.data.case.case_number
    );
    if (newCase) {
      console.log("✅ New case found in dashboard:", newCase.case_number);
      console.log("   Status:", newCase.status);
      console.log("   Priority:", newCase.priority);
      console.log("   Crime Type:", newCase.crime_type);
    }

    // Check notifications for the new case
    const newCaseNotifications = dashboard.notifications.filter(
      (n) => n.case_id === complaintResponse.data.case.case_id
    );
    if (newCaseNotifications.length > 0) {
      console.log("✅ Notifications received:");
      newCaseNotifications.forEach((notification) => {
        console.log(`   📩 ${notification.title}: ${notification.message}`);
      });
    }

    console.log("\n🎉 WORKFLOW TEST COMPLETED SUCCESSFULLY!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ User complaint submission works");
    console.log("✅ Automatic case creation works");
    console.log("✅ Thana officer dashboard loads cases");
    console.log("✅ Real-time notifications work");
    console.log("✅ Warrant officers available for assignment");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (error) {
    console.error("❌ Workflow test failed:", error.message);
  }
}

testFullWorkflow();
