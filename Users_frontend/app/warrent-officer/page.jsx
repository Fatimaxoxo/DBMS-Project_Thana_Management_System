"use client";
import React, { useState, useEffect } from "react";
import WarrantNavbar from "./components/WarrantNavbar";
import NotificationPanel from "./components/NotificationPanel";
import AssignedCases from "./components/AssignedCases";
import CaseProgress from "./components/CaseProgress";
import WarrantDetailsModal from "./components/WarrantDetailsModal";

export default function WarrantOfficerPage() {
  const [activeTab, setActiveTab] = useState("assigned");
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [officer, setOfficer] = useState({
    name: "ওয়ারেন্ট অফিসার",
    rank: "ওয়ারেন্ট অফিসার",
    thana: "লোডিং...",
    badge: "WO-XXXX",
    assignedCases: 0,
    completedCases: 0,
  });

  // Fetch dashboard data from API
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        "http://localhost:4000/api/officers/warrant/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
        setNotifications(data.notifications || []);

        // Update officer info
        const userInfo = JSON.parse(localStorage.getItem("user") || "{}");
        setOfficer({
          name: userInfo.name || "ওয়ারেন্ট অফিসার",
          rank: "ওয়ারেন্ট অফিসার",
          thana: `থানা ${userInfo.thana_id || "N/A"}`,
          badge: `WO-${userInfo.user_id || "XXXX"}`,
          assignedCases: data.statistics.totalCases,
          completedCases: data.statistics.completedCases,
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const assignedCases = dashboardData?.assignedCases || [];

  const handleUpdateProgress = (caseId, progressData) => {
    // Update progress logic here
    console.log(`Case ${caseId} progress updated:`, progressData);

    // Add a notification about the progress update
    const newNotification = {
      id: Date.now(),
      title: "অগ্রগতি আপডেট",
      description: `আপনি কেস ${caseId} এর অগ্রগতি আপডেট করেছেন`,
      time: "অভিমুহূর্তে",
      read: false,
      caseId: caseId,
      type: "progress_update",
    };

    setNotifications([newNotification, ...notifications]);
  };

  const handleViewCaseDetails = (caseData) => {
    setSelectedCase(caseData);
    setShowCaseModal(true);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">ডেটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <WarrantNavbar
        officer={officer}
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <NotificationPanel
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
            />

            <div className="bg-white rounded-2xl shadow-md p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                কেস পরিসংখ্যান
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-500 rounded-lg p-2 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">মোট কেস</p>
                      <p className="text-xl font-bold text-gray-800">
                        {dashboardData?.statistics.totalCases || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-yellow-500 rounded-lg p-2 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">চলমান কেস</p>
                      <p className="text-xl font-bold text-gray-800">
                        {dashboardData?.statistics.ongoingCases || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-green-500 rounded-lg p-2 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">সম্পন্ন কেস</p>
                      <p className="text-xl font-bold text-gray-800">
                        {dashboardData?.statistics.completedCases || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
              <div className="flex space-x-4 border-b">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "assigned"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("assigned")}
                >
                  অ্যাসাইনকৃত কেস ({assignedCases.length})
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "progress"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("progress")}
                >
                  অগ্রগতি রিপোর্ট
                </button>
              </div>
            </div>

            {activeTab === "assigned" && (
              <AssignedCases
                cases={assignedCases}
                onViewDetails={handleViewCaseDetails}
                onUpdateProgress={handleUpdateProgress}
              />
            )}

            {activeTab === "progress" && (
              <CaseProgress
                cases={assignedCases}
                onViewDetails={handleViewCaseDetails}
              />
            )}
          </div>
        </div>
      </div>

      {showCaseModal && (
        <WarrantDetailsModal
          caseData={selectedCase}
          onClose={() => setShowCaseModal(false)}
          onUpdateProgress={handleUpdateProgress}
        />
      )}
    </div>
  );
}
