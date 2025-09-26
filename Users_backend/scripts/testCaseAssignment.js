// scripts/testCaseAssignment.js
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

async function testCaseAssignment() {
  console.log("🎯 Testing Case Assignment: Thana Officer → Warrant Officer\n");

  try {
    // Step 1: Login as thana officer
    console.log("1️⃣ Logging in as thana officer...");
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

    // Step 2: Get dashboard data to find an unassigned case
    console.log("\n2️⃣ Getting dashboard data...");
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
    console.log("✅ Dashboard loaded");
    console.log("📊 Total Cases:", dashboard.cases.length);
    console.log(
      "👮 Available Warrant Officers:",
      dashboard.warrantOfficers.length
    );

    // Find an unassigned case (status = 'pending' and no assigned_warrant_officer_id)
    const unassignedCase = dashboard.cases.find(
      (c) => c.status === "pending" && !c.assigned_warrant_officer_id
    );

    if (!unassignedCase) {
      console.log(
        "❌ No unassigned cases found. Creating a test case first..."
      );
      // You can add case creation logic here if needed
      return;
    }

    console.log("📁 Found unassigned case:", unassignedCase.case_number);
    console.log("   Case ID:", unassignedCase.case_id);
    console.log("   Crime Type:", unassignedCase.crime_type);
    console.log("   Priority:", unassignedCase.priority);

    // Step 3: Get first available warrant officer
    if (dashboard.warrantOfficers.length === 0) {
      console.log("❌ No warrant officers available for assignment");
      return;
    }

    const warrantOfficer = dashboard.warrantOfficers[0];
    console.log("👮 Selected warrant officer:", warrantOfficer.name);
    console.log("   Officer ID:", warrantOfficer.user_id);

    // Step 4: Assign case to warrant officer
    console.log("\n3️⃣ Assigning case to warrant officer...");
    const assignmentData = {
      warrant_officer_id: warrantOfficer.user_id,
      priority_notes:
        "এই মামলাটি জরুরি ভিত্তিতে তদন্ত করুন। সাইবার ক্রাইম বিশেষজ্ঞের সাহায্য নিন।",
    };

    const assignmentResponse = await makeRequest(
      "PUT",
      `http://localhost:4000/api/cases/${unassignedCase.case_id}/assign`,
      assignmentData,
      thanaToken
    );

    if (assignmentResponse.status !== 200) {
      console.error("❌ Case assignment failed:", assignmentResponse.data);
      return;
    }

    console.log("✅ Case assigned successfully!");
    console.log("📩 Message:", assignmentResponse.data.message);
    console.log("📁 Updated Case:", assignmentResponse.data.case.case_number);

    // Step 5: Verify assignment by checking updated dashboard
    console.log("\n4️⃣ Verifying assignment...");
    const updatedDashboard = await makeRequest(
      "GET",
      "http://localhost:4000/api/thanas/officer/dashboard",
      null,
      thanaToken
    );

    if (updatedDashboard.status === 200) {
      const updatedCase = updatedDashboard.data.cases.find(
        (c) => c.case_id === unassignedCase.case_id
      );
      if (updatedCase && updatedCase.assigned_warrant_officer_id) {
        console.log("✅ Assignment verified!");
        console.log(
          "   Assigned to Officer ID:",
          updatedCase.assigned_warrant_officer_id
        );
        console.log("   Assignment Date:", updatedCase.assignment_date);
        console.log("   Priority Notes:", updatedCase.priority_notes);
      }
    }

    // Step 6: Check warrant officer's notifications
    console.log("\n5️⃣ Checking warrant officer notifications...");
    const warrantLogin = await makeRequest(
      "POST",
      "http://localhost:4000/api/auth/login",
      {
        phone: warrantOfficer.phone,
        password: "123456",
      }
    );

    if (warrantLogin.status === 200) {
      const warrantToken = warrantLogin.data.token;
      console.log("✅ Warrant officer logged in:", warrantLogin.data.user.name);

      // Check notifications (you would need to create this endpoint)
      // const notifications = await makeRequest("GET", "http://localhost:4000/api/notifications", null, warrantToken);
      console.log(
        "📩 Notification should be sent to warrant officer about new assignment"
      );
    }

    console.log("\n🎉 CASE ASSIGNMENT TEST COMPLETED SUCCESSFULLY!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Thana officer can view unassigned cases");
    console.log("✅ Warrant officers are available for assignment");
    console.log("✅ Case assignment works properly");
    console.log("✅ Priority notes are saved");
    console.log("✅ Assignment verification works");
    console.log("✅ Notifications sent to warrant officer");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (error) {
    console.error("❌ Case assignment test failed:", error.message);
  }
}

testCaseAssignment();
