"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WarrantNavbar from "./components/WarrantNavbar";
import AssignedCases from "./components/AssignedCases";
import CaseProgress from "./components/CaseProgress";
import WarrantDetailsModal from "./components/WarrantDetailsModal";

export default function WarrantOfficerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [assignedCases, setAssignedCases] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
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
    if (parsedUser.userType !== "warrant-officer") {
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

      // Get assigned cases
      const casesRes = await axios.get(
        `http://localhost:4000/api/cases?assigned_to=${userId}`,
        config
      );

      // Get notifications
      const notificationsRes = await axios.get(
        `http://localhost:4000/api/notifications?user_id=${userId}`,
        config
      );

      setAssignedCases(casesRes.data || []);
      setNotifications(notificationsRes.data.notifications || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        toast.error("তথ্য লোড করতে সমস্যা হয়েছে");
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

  const handleUpdateProgress = async (caseId, progressPercentage, notes) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/cases/${caseId}/progress`,
        {
          progress_percentage: progressPercentage,
          notes: notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("মামলার অগ্রগতি সফলভাবে আপডেট হয়েছে");

      // Refresh data
      fetchDashboardData(user.user_id, token);
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error(
        "অগ্রগতি আপডেটে সমস্যা হয়েছে: " +
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
    totalAssigned: assignedCases.length,
    pending: assignedCases.filter((c) => c.status === "assigned").length,
    investigating: assignedCases.filter((c) => c.status === "investigating")
      .length,
    completed: assignedCases.filter((c) => c.status === "resolved").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WarrantNavbar
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
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg text-white p-8 mb-8">
              <h1 className="text-3xl font-bold mb-2">
                স্বাগতম, {user?.name || "ওয়ারেন্ট অফিসার"}
              </h1>
              <p className="text-purple-100 text-lg">
                ওয়ারেন্ট অফিসার ড্যাশবোর্ড - তদন্ত বিভাগ
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
                        .map((notification) => (
                          <p
                            key={notification.id}
                            className="text-sm text-orange-700"
                          >
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

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="text-3xl text-blue-500 mr-4">📁</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      মোট মামলা
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalAssigned}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="text-3xl text-yellow-500 mr-4">⏳</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      নতুন বরাদ্দ
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.pending}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="text-3xl text-purple-500 mr-4">🔍</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      তদন্তাধীন
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.investigating}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="text-3xl text-green-500 mr-4">✅</div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      সমাধানকৃত
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.completed}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Cases Section */}
            <AssignedCases
              cases={assignedCases}
              onViewDetails={setSelectedCase}
              onUpdateProgress={setSelectedCase}
            />
          </>
        )}

        {activeTab === "cases" && (
          <AssignedCases
            cases={assignedCases}
            onViewDetails={setSelectedCase}
            onUpdateProgress={setSelectedCase}
          />
        )}

        {activeTab === "progress" && (
          <CaseProgress
            cases={assignedCases}
            onUpdateProgress={setSelectedCase}
          />
        )}

        {activeTab === "notifications" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">নোটিফিকেশন</h2>
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  কোনো নোটিফিকেশন নেই
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      notification.read_status
                        ? "bg-gray-50 border-gray-200"
                        : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.created_at).toLocaleDateString(
                            "bn-BD",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      {!notification.read_status && (
                        <button
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((n) =>
                                n.id === notification.id
                                  ? { ...n, read_status: true }
                                  : n
                              )
                            );
                          }}
                          className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          পড়া হয়েছে
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <WarrantDetailsModal
          case_={selectedCase}
          onClose={() => setSelectedCase(null)}
          onUpdateProgress={handleUpdateProgress}
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
