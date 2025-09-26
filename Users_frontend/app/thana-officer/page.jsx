"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OfficerNavbar from "./components/OfficerNavbar";
import CaseStatistics from "./components/CaseStatistics";
import CaseManagement from "./components/CaseManagement";
import NewCases from "./components/NewCases";
import PendingCases from "./components/PendingCases";
import OngoingCases from "./components/OngoingCases";
import NotificationPanel from "./components/NotificationPanel";
import CaseDetailsModal from "./components/CaseDetailsModal";
import AssignOfficerModal from "./components/AssignOfficerModal";

export default function ThanaOfficerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [complaints, setComplaints] = useState([]);
  const [cases, setCases] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [assignmentCase, setAssignmentCase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!userData || !token) {
      router.push("/login");
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.userType !== "thana-officer") {
      toast.error("অ্যাক্সেস নিষিদ্ধ");
      router.push("/login");
      return;
    }

    setUser(parsedUser);
    fetchDashboardData(parsedUser.user_id, token);

    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchDashboardData(parsedUser.user_id, token);
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [router]);

  const fetchDashboardData = async (userId, token) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Use new dashboard API endpoint
      const dashboardRes = await axios.get(
        "http://localhost:4000/api/thanas/officer/dashboard",
        config
      );

      const dashboardData = dashboardRes.data;
      setComplaints(dashboardData.complaints || []);
      setCases(dashboardData.cases || []);
      setNotifications(dashboardData.notifications || []);
      setOfficers(dashboardData.warrantOfficers || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        toast.error("তথ্য লোড করতে সমস্যা হয়েছে");

        // Fallback to individual API calls
        try {
          const config = {
            headers: { Authorization: `Bearer ${token}` },
          };

          const [complaintsRes, casesRes, notificationsRes, officersRes] =
            await Promise.all([
              axios.get("http://localhost:4000/api/complaints", config),
              axios.get("http://localhost:4000/api/cases", config),
              axios.get("http://localhost:4000/api/notifications", config),
              axios.get(
                "http://localhost:4000/api/officers/warrant/all",
                config
              ),
            ]);

          setComplaints(complaintsRes.data || []);
          setCases(casesRes.data || []);
          setNotifications(notificationsRes.data.notifications || []);
          setOfficers(officersRes.data || []);
        } catch (fallbackError) {
          console.error("Fallback fetch also failed:", fallbackError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("সফলভাবে লগআউট হয়েছে");
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  const handleCreateCase = async (complaintId, caseData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/cases",
        { complaint_id: complaintId, ...caseData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("মামলা সফলভাবে তৈরি হয়েছে");

      // Refresh data
      fetchDashboardData(user.id, token);
    } catch (error) {
      console.error("Error creating case:", error);
      toast.error("মামলা তৈরি করতে সমস্যা হয়েছে");
    }
  };

  const handleAssignOfficer = async (caseId, officerId, priorityNotes = "") => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:4000/api/thanas/cases/${caseId}/assign`,
        {
          warrant_officer_id: officerId,
          priority_notes: priorityNotes,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("ওয়ারেন্ট অফিসার সফলভাবে নিয়োগ দেওয়া হয়েছে");

      // Refresh data
      fetchDashboardData(user.user_id, token);
    } catch (error) {
      console.error("Error assigning officer:", error);
      toast.error(
        "অফিসার নিয়োগে সমস্যা হয়েছে: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const stats = {
    totalComplaints: complaints.length,
    newComplaints: complaints.filter((c) => c.status === "pending").length,
    totalCases: cases.length,
    pendingCases: cases.filter((c) => c.status === "pending").length,
    ongoingCases: cases.filter((c) => c.status === "in_progress").length,
    completedCases: cases.filter((c) => c.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <OfficerNavbar
        officer={user}
        notifications={notifications}
        onMarkAsRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === "dashboard" && (
          <>
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-lg text-white p-8 mb-8">
              <h1 className="text-3xl font-bold mb-2">
                স্বাগতম, {user?.name || "থানা অফিসার"}
              </h1>
              <p className="text-green-100 text-lg">
                থানা অফিসার ড্যাশবোর্ড - {user?.thana_name || ""}
              </p>
            </div>

            {/* New Notifications Banner */}
            {notifications.filter((n) => !n.read_status).length > 0 && (
              <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6 rounded-lg">
                <div className="flex items-center">
                  <div className="text-orange-400 text-xl mr-3">🔔</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-orange-800">
                      নতুন নোটিফিকেশন (
                      {notifications.filter((n) => !n.read_status).length})
                    </h3>
                    <div className="mt-2 space-y-1">
                      {notifications
                        .filter((n) => !n.read_status)
                        .slice(0, 3)
                        .map((notification, index) => (
                          <p key={index} className="text-sm text-orange-700">
                            • {notification.title}: {notification.message}
                          </p>
                        ))}
                      {notifications.filter((n) => !n.read_status).length >
                        3 && (
                        <p className="text-sm text-orange-600 font-medium">
                          আরো{" "}
                          {notifications.filter((n) => !n.read_status).length -
                            3}{" "}
                          টি নোটিফিকেশন...
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    সব দেখুন
                  </button>
                </div>
              </div>
            )}

            {/* Statistics */}
            <CaseStatistics stats={stats} />

            {/* Case Management Section */}
            <div className="mt-8">
              <CaseManagement
                cases={cases}
                warrantOfficers={officers}
                onAssignOfficer={handleAssignOfficer}
                onViewDetails={setSelectedCase}
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Recent Complaints */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    সাম্প্রতিক অভিযোগ
                  </h2>
                </div>
                <div className="p-6">
                  {complaints.slice(0, 5).length > 0 ? (
                    <div className="space-y-4">
                      {complaints.slice(0, 5).map((complaint, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {complaint.crime_type}
                            </p>
                            <p className="text-sm text-gray-600">
                              {complaint.incident_location}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(
                                complaint.created_at
                              ).toLocaleDateString("bn-BD")}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              complaint.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : complaint.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {complaint.status === "pending"
                              ? "নতুন"
                              : complaint.status === "resolved"
                              ? "সমাধানকৃত"
                              : complaint.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <span className="text-4xl mb-4 block">📝</span>
                      <p>কোনো নতুন অভিযোগ নেই</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Cases */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    সাম্প্রতিক মামলা
                  </h2>
                </div>
                <div className="p-6">
                  {cases.slice(0, 5).length > 0 ? (
                    <div className="space-y-4">
                      {cases.slice(0, 5).map((case_, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                          onClick={() => setSelectedCase(case_)}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              মামলা নং: {case_.case_number}
                            </p>
                            <p className="text-sm text-gray-600">
                              অগ্রগতি: {case_.progress_percentage || 0}%
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(case_.created_at).toLocaleDateString(
                                "bn-BD"
                              )}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              case_.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : case_.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : case_.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {case_.status === "pending"
                              ? "নতুন"
                              : case_.status === "in_progress"
                              ? "চলমান"
                              : case_.status === "completed"
                              ? "সম্পন্ন"
                              : case_.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <span className="text-4xl mb-4 block">📁</span>
                      <p>কোনো মামলা নেই</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "new-cases" && (
          <NewCases
            complaints={complaints.filter((c) => c.status === "pending")}
            onCreateCase={handleCreateCase}
          />
        )}

        {activeTab === "pending-cases" && (
          <PendingCases
            cases={cases.filter((c) => c.status === "pending")}
            officers={officers}
            onAssignOfficer={(case_) => setAssignmentCase(case_)}
            onViewDetails={setSelectedCase}
          />
        )}

        {activeTab === "ongoing-cases" && (
          <OngoingCases
            cases={cases.filter((c) => c.status === "in_progress")}
            onViewDetails={setSelectedCase}
          />
        )}

        {activeTab === "notifications" && (
          <NotificationPanel
            notifications={notifications}
            onMarkAsRead={(id) => {
              // Mark notification as read
              setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read_status: true } : n))
              );
            }}
          />
        )}
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <CaseDetailsModal
          case_={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdate={() => {
            const token = localStorage.getItem("token");
            fetchDashboardData(user.user_id, token);
          }}
        />
      )}

      {/* Assignment Modal */}
      {assignmentCase && (
        <AssignOfficerModal
          isOpen={!!assignmentCase}
          onClose={() => setAssignmentCase(null)}
          case_={assignmentCase}
          warrantOfficers={officers}
          onAssign={handleAssignOfficer}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
