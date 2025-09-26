"use client";
import React from "react";

export default function WarrantNavbar({
  officer,
  notifications,
  onMarkAsRead,
  onLogout,
  activeTab,
  setActiveTab,
}) {
  const unreadCount = notifications.filter((n) => !n.read_status).length;

  const navItems = [
    { id: "dashboard", label: "ড্যাশবোর্ড", icon: "🏠" },
    { id: "cases", label: "আমার মামলা", icon: "📁" },
    { id: "progress", label: "অগ্রগতি ট্র্যাক", icon: "📊" },
    {
      id: "notifications",
      label: "নোটিফিকেশন",
      icon: "🔔",
      badge: unreadCount,
    },
  ];

  return (
    <nav className="bg-purple-600 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <div className="text-white text-2xl font-bold mr-8">
              🚨 ওয়ারেন্ট অফিসার প্যানেল
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`px-3 py-2 rounded-md text-sm font-medium relative ${
                      activeTab === item.id
                        ? "bg-purple-700 text-white"
                        : "text-purple-100 hover:bg-purple-500 hover:text-white"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                    {item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <div className="text-purple-100 text-sm">
              <div className="font-medium">
                {officer?.name || "ওয়ারেন্ট অফিসার"}
              </div>
              <div className="text-xs">তদন্ত বিভাগ</div>
            </div>

            <button
              onClick={onLogout}
              className="bg-purple-500 hover:bg-purple-400 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              লগআউট
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium relative ${
                  activeTab === item.id
                    ? "bg-purple-700 text-white"
                    : "text-purple-100 hover:bg-purple-500 hover:text-white"
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
                {item.badge > 0 && (
                  <span className="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
