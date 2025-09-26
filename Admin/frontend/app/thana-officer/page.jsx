"use client";
import React, { useState } from "react";
import OfficerNavbar from "./components/OfficerNavbar";
import NotificationPanel from "./components/NotificationPanel";
import CaseStatistics from "./components/CaseStatistics";
import NewCases from "./components/NewCases";
import PendingCases from "./components/PendingCases";
import OngoingCases from "./components/OngoingCases";
import CaseDetailsModal from "./components/CaseDetailsModal";

export default function ThanaOfficerPage() {
  const [activeTab, setActiveTab] = useState("new");
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "নতুন অভিযোগ দাখিল",
      description: "সাকিব আহমেদ একটি নতুন অভিযোগ দাখিল করেছেন",
      time: "১০ মিনিট আগে",
      read: false,
      caseId: 101,
    },
    {
      id: 2,
      title: "অভিযোগ আপডেট",
      description: "রহিম উদ্দিন তার অভিযোগে নতুন তথ্য যোগ করেছেন",
      time: "৩০ মিনিট আগে",
      read: false,
      caseId: 102,
    },
  ]);

  const officer = {
    name: "মোঃ রাজু আহমেদ",
    rank: "সাব-ইন্সপেক্টর",
    thana: "মিরপুর থানা",
    badge: "SI-4567",
  };

  const casesData = {
    new: [
      {
        id: 101,
        title: "উচ্চ শব্দের অভিযোগ",
        complainant: "সাকিব আহমেদ",
        phone: "+8801712345678",
        date: "২০ আগস্ট, ২০২৫",
        location: "মিরপুর-১০, রোড-৫",
        priority: "মাধ্যম",
        description:
          "পাড়ায় অতিরিক্ত উচ্চ শব্দ হয়, রাতে ঘুমাতে সমস্যা হচ্ছে।",
      },
      {
        id: 102,
        title: "রাস্তার আলো নষ্ট",
        complainant: "রহিম উদ্দিন",
        phone: "+8801812345678",
        date: "১৯ আগস্ট, ২০২৫",
        location: "মিরপুর-১২, ব্লক-সি",
        priority: "নিম্ন",
        description: "মেইন রোডের তিনটি আলো এক সপ্তাহ ধরে নষ্ট আছে।",
      },
    ],
    pending: [
      {
        id: 201,
        title: "জমি বিরোধ",
        complainant: "করিম উদ্দিন",
        phone: "+8801912345678",
        date: "১৮ আগস্ট, ২০২৫",
        assignedTo: "মোঃ সোহেল রানা",
        status: "তদন্তাধীন",
        notes: "প্রাথমিক তদন্ত সম্পন্ন, প্রতিবেদন প্রস্তুত হচ্ছে",
      },
    ],
    ongoing: [
      {
        id: 301,
        title: "চুরির অভিযোগ",
        complainant: "আনিকা আহমেদ",
        phone: "+8801512345678",
        date: "১৫ আগস্ট, ২০২৫",
        assignedTo: "মোঃ রাজু আহমেদ",
        status: "চলমান তদন্ত",
        progress: 65,
        nextHearing: "২৫ আগস্ট, ২০২৫",
      },
    ],
  };

  const handleAssignCase = (caseId, officerName) => {
    // Case assignment logic here
    console.log(`Case ${caseId} assigned to ${officerName}`);

    // Remove notification for this case
    setNotifications(notifications.filter((notif) => notif.caseId !== caseId));
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
      <OfficerNavbar
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

            <CaseStatistics
              newCases={casesData.new.length}
              pendingCases={casesData.pending.length}
              ongoingCases={casesData.ongoing.length}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
              <div className="flex space-x-4 border-b">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "new"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("new")}
                >
                  নতুন অভিযোগ ({casesData.new.length})
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "pending"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("pending")}
                >
                  মুলতুবি ({casesData.pending.length})
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "ongoing"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("ongoing")}
                >
                  চলমান ({casesData.ongoing.length})
                </button>
              </div>
            </div>

            {activeTab === "new" && (
              <NewCases
                cases={casesData.new}
                onAssignCase={handleAssignCase}
                onViewDetails={handleViewCaseDetails}
              />
            )}

            {activeTab === "pending" && (
              <PendingCases
                cases={casesData.pending}
                onViewDetails={handleViewCaseDetails}
              />
            )}

            {activeTab === "ongoing" && (
              <OngoingCases
                cases={casesData.ongoing}
                onViewDetails={handleViewCaseDetails}
              />
            )}
          </div>
        </div>
      </div>

      {showCaseModal && (
        <CaseDetailsModal
          caseData={selectedCase}
          onClose={() => setShowCaseModal(false)}
        />
      )}
    </div>
  );
}
