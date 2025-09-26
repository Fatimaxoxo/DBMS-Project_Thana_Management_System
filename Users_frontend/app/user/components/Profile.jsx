"use client";
import React from "react";

export default function Profile({ user, onViewComplaints }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">
      {/* User Info */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center font-bold text-xl">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-blue-600">{user.thana}</p>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span>{user.email}</span>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-3 text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <span>{user.phone}</span>
        </div>

        {/* Address */}
        <div className="flex items-start space-x-3 text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500 mt-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{user.address}</span>
        </div>
      </div>

      {/* Complaints Count + Button */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">মোট অভিযোগ</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {user.totalComplaints}
          </span>
        </div>

        <button
          onClick={onViewComplaints}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          সকল অভিযোগ দেখুন
        </button>
      </div>
    </div>
  );
}
