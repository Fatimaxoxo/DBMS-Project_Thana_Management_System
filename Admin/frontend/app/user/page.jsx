"use client";
import React, { useState, useRef } from "react";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import ComplaintsHistory from "./components/ComplaintsHistory";
import NewComplaintForm from "./components/NewComplaintForm";

export default function UserPage() {
  const [user] = useState({
    name: "সাকিব আহমেদ",
    email: "sakib@example.com",
    phone: "+৮৮০১XXXXXXXXX",
    thana: "মিরপুর থানা",
    address: "মিরপুর-১০, ঢাকা",
    totalComplaints: 2,
  });

  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "উচ্চ শব্দের অভিযোগ",
      description: "পাড়ায় অতিরিক্ত উচ্চ শব্দ হয়, রাতে ঘুমাতে সমস্যা হচ্ছে।",
      date: "২০ আগস্ট, ২০২৫",
      status: "নিষ্পত্তিকৃত",
    },
    {
      id: 2,
      title: "রাস্তার আলো নষ্ট",
      description: "মেইন রোডের তিনটি আলো এক সপ্তাহ ধরে নষ্ট আছে।",
      date: "১৫ আগস্ট, ২০২৫",
      status: "অগ্রগতিতে",
    },
  ]);

  const complaintsRef = useRef(null);

  const handleLogout = () => {
    alert("লগআউট করা হয়েছে!");
    // 👉 এখানে চাইলে router.push("/") করে লগইন পেজে পাঠাতে পারো
  };

  const handleNewComplaint = (newComplaint) => {
    const complaintWithId = {
      ...newComplaint,
      id: complaints.length + 1,
      date: new Date().toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      status: "নতুন",
    };
    setComplaints([complaintWithId, ...complaints]);
  };

  const handleViewComplaints = () => {
    complaintsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile */}
          <div className="lg:col-span-1">
            <Profile user={user} onViewComplaints={handleViewComplaints} />
          </div>

          {/* Complaints Section */}
          <div className="lg:col-span-2 space-y-6" ref={complaintsRef}>
            <NewComplaintForm onSubmit={handleNewComplaint} />
            <ComplaintsHistory complaints={complaints} />
          </div>
        </div>
      </div>
    </div>
  );
}
