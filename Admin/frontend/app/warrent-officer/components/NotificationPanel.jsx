"use client";
import React from "react";

export default function NotificationPanel({ notifications, onMarkAsRead }) {
  const unreadNotifications = notifications.filter((n) => !n.read);

  return (
    <div className="bg-white rounded-2xl shadow-md p-5">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-indigo-600 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        নোটিফিকেশন
      </h2>

      {unreadNotifications.length > 0 ? (
        <div className="space-y-3">
          {unreadNotifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 cursor-pointer hover:bg-indigo-100 transition"
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-indigo-800">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-indigo-600 mt-1">
                    {notification.description}
                  </p>
                  {notification.caseId && (
                    <span className="text-xs text-indigo-500 mt-1 block">
                      কেস আইডি: {notification.caseId}
                    </span>
                  )}
                </div>
                <span className="text-xs text-indigo-500 whitespace-nowrap">
                  {notification.time}
                </span>
              </div>
            </div>
          ))}

          {unreadNotifications.length > 5 && (
            <div className="text-center pt-2">
              <button className="text-indigo-600 text-sm font-medium">
                আরও {unreadNotifications.length - 5} টি নোটিফিকেশন
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-gray-300 mx-auto mb-2"
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
          <p className="text-gray-500">কোনো নতুন নোটিফিকেশন নেই</p>
        </div>
      )}
    </div>
  );
}
