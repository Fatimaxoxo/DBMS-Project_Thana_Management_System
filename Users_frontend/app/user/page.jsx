"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import NewComplaintForm from "./components/NewComplaintForm";
import ComplaintsHistory from "./components/ComplaintsHistory";

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [complaints, setComplaints] = useState([]);
  const [cases, setCases] = useState([]);
  const [notifications, setNotifications] = useState([]);
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
    if (parsedUser.role !== "user") {
      toast.error("অ্যাক্সেস নিষিদ্ধ");
      router.push("/login");
      return;
    }

    setUser(parsedUser);
    fetchUserData(parsedUser.id, token);
  }, [router]);

  const fetchUserData = async (userId, token) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Fetch user complaints
      const complaintsRes = await axios.get(
        `http://localhost:4000/api/complaints?user_id=${userId}`,
        config
      );
      setComplaints(complaintsRes.data || []);

      // Fetch user cases
      const casesRes = await axios.get(
        `http://localhost:4000/api/cases?user_id=${userId}`,
        config
      );
      setCases(casesRes.data || []);

      // Fetch notifications
      const notificationsRes = await axios.get(
        `http://localhost:4000/api/notifications/${userId}`,
        config
      );
      setNotifications(notificationsRes.data.notifications || []);
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        router.push("/login");
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

  const handleComplaintSubmitted = () => {
    // Refresh complaints after new submission
    if (user) {
      const token = localStorage.getItem("token");
      fetchUserData(user.id, token);
    }
    setActiveTab("complaints");
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
    pendingComplaints: complaints.filter((c) => c.status === "pending").length,
    resolvedComplaints: complaints.filter((c) => c.status === "resolved")
      .length,
    activeCases: cases.filter((c) => c.status !== "completed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        notifications={notifications}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === "dashboard" && (
          <>
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg text-white p-8 mb-8">
              <h1 className="text-3xl font-bold mb-2">স্বাগতম, {user.name}</h1>
              <p className="text-blue-100 text-lg">
                ডিজিটাল থানা ব্যবস্থাপনা সিস্টেমে আপনাকে স্বাগতম
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      মোট অভিযোগ
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalComplaints}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      বিচারাধীন
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.pendingComplaints}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <span className="text-2xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      সমাধানকৃত
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.resolvedComplaints}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <span className="text-2xl">📁</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      সক্রিয় মামলা
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.activeCases}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => setActiveTab("new-complaint")}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left border-2 border-transparent hover:border-blue-200"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    নতুন অভিযোগ
                  </h3>
                </div>
                <p className="text-gray-600">
                  অপরাধের বিরুদ্ধে নতুন অভিযোগ দাখিল করুন
                </p>
              </button>

              <button
                onClick={() => setActiveTab("complaints")}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left border-2 border-transparent hover:border-green-200"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-green-100">
                    <span className="text-2xl">📋</span>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    অভিযোগের ইতিহাস
                  </h3>
                </div>
                <p className="text-gray-600">
                  আপনার পূর্ববর্তী অভিযোগসমূহ দেখুন
                </p>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left border-2 border-transparent hover:border-purple-200"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-purple-100">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    প্রোফাইল
                  </h3>
                </div>
                <p className="text-gray-600">
                  আপনার ব্যক্তিগত তথ্য দেখুন ও সম্পাদনা করুন
                </p>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  সাম্প্রতিক কার্যকলাপ
                </h2>
              </div>
              <div className="p-6">
                {complaints.length > 0 || cases.length > 0 ? (
                  <div className="space-y-4">
                    {/* Show recent complaints and cases */}
                    {complaints.slice(0, 3).map((complaint, index) => (
                      <div
                        key={`complaint-${index}`}
                        className="flex items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <span className="text-2xl mr-4">📝</span>
                        <div className="flex-1">
                          <p className="font-medium">{complaint.crime_type}</p>
                          <p className="text-sm text-gray-600">
                            {complaint.created_at}
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
                            ? "বিচারাধীন"
                            : complaint.status === "resolved"
                            ? "সমাধানকৃত"
                            : complaint.status}
                        </span>
                      </div>
                    ))}
                    {cases.slice(0, 2).map((case_, index) => (
                      <div
                        key={`case-${index}`}
                        className="flex items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <span className="text-2xl mr-4">📁</span>
                        <div className="flex-1">
                          <p className="font-medium">
                            মামলা নং: {case_.case_number}
                          </p>
                          <p className="text-sm text-gray-600">
                            অগ্রগতি: {case_.progress_percentage || 0}%
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
                    <span className="text-4xl mb-4 block">📋</span>
                    <p>এখনো কোনো কার্যকলাপ নেই</p>
                    <p className="text-sm">নতুন অভিযোগ দাখিল করে শুরু করুন</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "profile" && <Profile user={user} />}
        {activeTab === "new-complaint" && (
          <NewComplaintForm onSuccess={handleComplaintSubmitted} />
        )}
        {activeTab === "complaints" && (
          <ComplaintsHistory complaints={complaints} cases={cases} />
        )}
      </div>

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
