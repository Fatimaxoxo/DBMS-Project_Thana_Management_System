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

  const officer = {
    name: "মোঃ কামাল হোসেন",
    rank: "ওয়ারেন্ট অফিসার",
    thana: "মিরপুর থানা",
    badge: "WO-7890",
    assignedCases: 5,
    completedCases: 12,
  };

  const assignedCases = [
    {
      id: 301,
      title: "চুরির অভিযোগ - মোবাইল ফোন",
      complainant: "আনিকা আহমেদ",
      phone: "+8801512345678",
      date: "১৫ আগস্ট, ২০২৫",
      assignedDate: "১৬ আগস্ট, ২০২৫",
      priority: "উচ্চ",
      status: "চলমান তদন্ত",
      progress: 65,
      nextHearing: "২৫ আগস্ট, ২০২৫",
      location: "মিরপুর-১০, বাসা নং ২৫",
      description:
        "বাসা থেকে সamsung গ্যালাক্সি মোবাইল ফোন চুরি হয়েছে। সন্দেহভাজন পাড়ার এক যুবক।",
      assignedBy: "মোঃ রাজু আহমেদ, সাব-ইন্সপেক্টর",
      evidence: ["চুরির স্থানের ফটো", "সিসি ক্যামেরা ফুটেজ"],
      actionsTaken:
        "সন্দেহভাজনের বাসায় তল্লাশি পরিচালনা, প্রতিবেশীদের জিজ্ঞাসাবাদ",
      nextSteps: "সিসি ক্যামেরা ফুটেজ সংগ্রহ, সন্দেহভাজনের ফোন রেকর্ড চেক করা",
    },
    {
      id: 302,
      title: "জালিয়াতির অভিযোগ",
      complainant: "রফিকুল ইসলাম",
      phone: "+8801612345678",
      date: "১৭ আগস্ট, ২০২৫",
      assignedDate: "১৮ আগস্ট, ২০২৫",
      priority: "মাধ্যম",
      status: "প্রাথমিক তদন্ত",
      progress: 30,
      nextHearing: "২৮ আগস্ট, ২০২৫",
      location: "মিরপুর-১২, দোকান নং ৪৫",
      description:
        "জাল দলিল দিয়ে জমি দখলের চেষ্টা। সন্দেহভাজন একটি দলিল লেখক।",
      assignedBy: "মোঃ সোহেল রানা, কনস্টেবল",
      evidence: ["জাল দলিলের কপি", "সাক্ষীর বিবৃতি"],
      actionsTaken: "দলিল লেখকের দোকানে তল্লাশি, জাল দলিল জব্দ",
      nextSteps: "দলিল বিশেষজ্ঞের মতামত নেওয়া, ব্যাংক রেকর্ড পরীক্ষা",
    },
  ];

  // Simulate receiving new notifications
  useEffect(() => {
    const simulatedNotifications = [
      {
        id: 1,
        title: "নতুন কেস অ্যাসাইন",
        description:
          "আপনাকে 'চুরির অভিযোগ - মোবাইল ফোন' কেসটি অ্যাসাইন করা হয়েছে",
        time: "১০ মিনিট আগে",
        read: false,
        caseId: 301,
        type: "case_assigned",
      },
      {
        id: 2,
        title: "কেস আপডেট",
        description:
          "আপনার 'জালিয়াতির অভিযোগ' কেসে নতুন Evidence যোগ করা হয়েছে",
        time: "২ ঘন্টা আগে",
        read: false,
        caseId: 302,
        type: "case_updated",
      },
      {
        id: 3,
        title: "মিটিং রিমাইন্ডার",
        description: "আজ সন্ধ্যা ৬টায় কেস ৩০১ সম্পর্কিত মিটিং আছে",
        time: "৩ ঘন্টা আগে",
        read: false,
        type: "meeting",
      },
    ];

    setNotifications(simulatedNotifications);
  }, []);

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
                      <p className="text-sm text-gray-600">অ্যাসাইনকৃত কেস</p>
                      <p className="text-xl font-bold text-gray-800">
                        {officer.assignedCases}
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
                        {officer.completedCases}
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
