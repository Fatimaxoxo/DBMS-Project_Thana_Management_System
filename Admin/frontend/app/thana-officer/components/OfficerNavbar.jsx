"use client";
import React, { useState } from "react";

export default function OfficerNavbar({
  officer,
  notifications,
  onMarkAsRead,
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="bg-white text-blue-800 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
            {officer.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h1 className="text-xl font-bold">থানা অফিসার ড্যাশবোর্ড</h1>
            <p className="text-sm text-blue-200">{officer.thana}</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <button
              className="relative p-2 text-blue-200 hover:text-white transition"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
                <div className="p-3 border-b border-gray-200 font-semibold text-gray-700 flex justify-between items-center">
                  <span>নোটিফিকেশন</span>
                  <button
                    className="text-blue-600 text-sm"
                    onClick={() =>
                      notifications.forEach((n) => onMarkAsRead(n.id))
                    }
                  >
                    সব পড়ে নিন
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer ${
                          notification.read ? "bg-gray-50" : "bg-blue-50"
                        }`}
                        onClick={() => onMarkAsRead(notification.id)}
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-800">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.description}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      কোনো নোটিফিকেশন নেই
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="text-right hidden md:block">
            <p className="font-semibold">{officer.name}</p>
            <p className="text-sm text-blue-200">
              {officer.rank} - {officer.badge}
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
