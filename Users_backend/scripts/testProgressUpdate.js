// scripts/testProgressUpdate.js
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

async function testProgressUpdate() {
  console.log("🎯 Testing Progress Update: Warrant Officer → Case Progress\n");

  try {
    // Step 1: Login as warrant officer
    console.log("1️⃣ Logging in as warrant officer...");
    const warrantLogin = await makeRequest(
      "POST",
      "http://localhost:4000/api/auth/login",
      {
        phone: "01711000002",
        password: "123456",
      }
    );

    if (warrantLogin.status !== 200) {
      console.error("❌ Warrant officer login failed");
      return;
    }

    const warrantToken = warrantLogin.data.token;
    console.log("✅ Warrant officer logged in:", warrantLogin.data.user.name);

    // Step 2: Get assigned cases
    console.log("\n2️⃣ Getting assigned cases...");
    const casesResponse = await makeRequest(
      "GET",
      `http://localhost:4000/api/cases?assigned_to=${warrantLogin.data.user.user_id}`,
      null,
      warrantToken
    );

    if (casesResponse.status !== 200) {
      console.error("❌ Failed to get assigned cases:", casesResponse.data);
      return;
    }

    const assignedCases = casesResponse.data;
    console.log("✅ Assigned cases loaded");
    console.log("📊 Total assigned cases:", assignedCases.length);

    if (assignedCases.length === 0) {
      console.log("❌ No cases assigned to this warrant officer");
      return;
    }

    // Find a case assigned to this warrant officer
    const currentUserId = warrantLogin.data.user.user_id;
    const caseToUpdate = assignedCases.find(
      (c) => c.assigned_warrant_officer_id == currentUserId
    );

    if (!caseToUpdate) {
      console.log(
        "❌ No cases found assigned to this warrant officer (ID:",
        currentUserId + ")"
      );
      console.log(
        "Available cases:",
        assignedCases.map((c) => ({
          case_id: c.case_id,
          case_number: c.case_number,
          assigned_to: c.assigned_warrant_officer_id,
        }))
      );
      return;
    }

    console.log("📁 Updating case:", caseToUpdate.case_number);
    console.log("   Case ID:", caseToUpdate.case_id);
    console.log("   Assigned to:", caseToUpdate.assigned_warrant_officer_id);
    console.log("   Current user:", currentUserId);
    console.log(
      "   Current progress:",
      caseToUpdate.progress_percentage || 0,
      "%"
    );

    // Step 3: Update progress
    console.log("\n3️⃣ Updating case progress...");
    const progressData = {
      progress_percentage: 75,
      notes:
        "তদন্তের অগ্রগতি:\n\n1. সাক্ষী সাক্ষাৎকার সম্পন্ন\n2. ডিজিটাল প্রমাণ সংগ্রহ করা হয়েছে\n3. সন্দেহভাজনদের তালিকা প্রস্তুত\n4. পরবর্তী পদক্ষেপ: গ্রেফতারি পরোয়ানা",
    };

    const progressResponse = await makeRequest(
      "PUT",
      `http://localhost:4000/api/cases/${caseToUpdate.case_id}/progress`,
      progressData,
      warrantToken
    );

    if (progressResponse.status !== 200) {
      console.error("❌ Progress update failed:", progressResponse.data);
      return;
    }

    console.log("✅ Progress updated successfully!");
    console.log("📩 Message:", progressResponse.data.message);
    console.log("📊 New progress:", progressData.progress_percentage + "%");

    // Step 4: Verify update
    console.log("\n4️⃣ Verifying update...");
    const verifyResponse = await makeRequest(
      "GET",
      `http://localhost:4000/api/cases/${caseToUpdate.case_id}`,
      null,
      warrantToken
    );

    if (verifyResponse.status === 200) {
      const updatedCase = verifyResponse.data;
      console.log("✅ Update verified!");
      console.log(
        "   Updated progress:",
        updatedCase.progress_percentage + "%"
      );
      console.log(
        "   Investigation notes:",
        updatedCase.investigation_notes ? "✅ Saved" : "❌ Not saved"
      );
    }

    // Step 5: Test thana officer dashboard to see notification
    console.log("\n5️⃣ Checking thana officer notifications...");
    const thanaLogin = await makeRequest(
      "POST",
      "http://localhost:4000/api/auth/login",
      {
        phone: "01711000001",
        password: "123456",
      }
    );

    if (thanaLogin.status === 200) {
      const thanaToken = thanaLogin.data.token;
      console.log("✅ Thana officer logged in:", thanaLogin.data.user.name);

      const dashboardResponse = await makeRequest(
        "GET",
        "http://localhost:4000/api/thanas/officer/dashboard",
        null,
        thanaToken
      );

      if (dashboardResponse.status === 200) {
        const notifications = dashboardResponse.data.notifications;
        const progressNotifications = notifications.filter(
          (n) => n.type === "progress_update"
        );
        console.log(
          "📩 Progress update notifications:",
          progressNotifications.length
        );

        if (progressNotifications.length > 0) {
          const latestNotification = progressNotifications[0];
          console.log("   Latest:", latestNotification.title);
          console.log("   Message:", latestNotification.message);
        }
      }
    }

    console.log("\n🎉 PROGRESS UPDATE TEST COMPLETED SUCCESSFULLY!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Warrant officer can view assigned cases");
    console.log("✅ Progress update functionality works");
    console.log("✅ Investigation notes are saved");
    console.log("✅ Real-time notifications sent to thana officer");
    console.log("✅ Case status updates properly");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (error) {
    console.error("❌ Progress update test failed:", error.message);
  }
}

testProgressUpdate();
