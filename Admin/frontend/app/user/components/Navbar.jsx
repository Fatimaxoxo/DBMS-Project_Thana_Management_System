"use client";
import Link from "next/link";
import React from "react";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="bg-white text-blue-800 rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <h1 className="text-xl font-bold">থানা ব্যবস্থাপনা পোর্টাল</h1>
          <p className="text-sm text-blue-200">
            অনলাইন অভিযোগ ব্যবস্থাপনা সিস্টেম
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-right hidden md:block">
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-blue-200">{user.thana}</p>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
        >
          <Link href="/login">
            <span>লগআউট</span>
          </Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}
