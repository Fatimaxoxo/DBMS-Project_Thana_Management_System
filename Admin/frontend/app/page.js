"use client";

import React from "react";
import Link from "next/link";

const sections = [
  {
    name: "Thana Management",
    href: "/thanas",
    color: "bg-blue-600 hover:bg-blue-700",
    icon: "🏢",
  },
  {
    name: "Victim Records",
    href: "/victims",
    color: "bg-green-600 hover:bg-green-700",
    icon: "👤",
  },
  {
    name: "Crime Detection",
    href: "/crimes",
    color: "bg-red-600 hover:bg-red-700",
    icon: "🔍",
  },
  {
    name: "Officer Management",
    href: "/officers",
    color: "bg-yellow-600 hover:bg-yellow-700",
    icon: "👮",
  },
  {
    name: "Complaints",
    href: "/complaints",
    color: "bg-purple-600 hover:bg-purple-700",
    icon: "📝",
  },
  {
    name: "Case Filing",
    href: "/cases",
    color: "bg-pink-600 hover:bg-pink-700",
    icon: "📁",
  },
  {
    name: "Case Handover Log",
    href: "/handovers",
    color: "bg-indigo-600 hover:bg-indigo-700",
    icon: "🔄",
  },
  {
    name: "Analytics Dashboard",
    href: "/analytics",
    color: "bg-teal-600 hover:bg-teal-700",
    icon: "📊",
  },
];

export default function AdminHome() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with Police Theme */}
      <nav className="bg-[#0a4b78] text-white p-4 shadow-md">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/de/Bangladesh_Police_Insignia_Patch.svg" // Replace with your police badge image
              alt="Bangladesh Police Badge"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-xl font-bold">Bangladesh Police</h1>
              <p className="text-sm opacity-80">
                Administrative Control System
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {sections.map((sec) => (
              <Link
                key={sec.name}
                href={sec.href}
                className="px-3 py-1 text-sm rounded-md hover:bg-white/10 transition-colors"
              >
                {sec.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0a4b78] to-[#0a2b4b] text-white py-12 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Bangladesh Police Administrative Portal
            </h1>
            <p className="text-lg opacity-90 mb-6">
              Comprehensive management system for law enforcement operations,
              case tracking, and resource allocation.
            </p>
            <div className="flex space-x-4">
              <button className="bg-white text-[#0a4b78] px-6 py-2 rounded-md font-medium hover:bg-opacity-90 transition">
                Quick Actions
              </button>
              <button className="border border-white text-white px-6 py-2 rounded-md font-medium hover:bg-white/10 transition">
                View Statistics
              </button>
            </div>
          </div>
          <img
            src="/banner2.png" // Replace with appropriate police image
            alt="Police Officers"
            className="w-full max-w-md rounded-lg shadow-xl border-4 border-white/20"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            System Modules
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sections.map((sec) => (
            <Link
              key={sec.name}
              href={sec.href}
              className={`${sec.color} rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg`}
            >
              <div className="p-6 flex flex-col h-full">
                <div className="text-4xl mb-4">{sec.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {sec.name}
                </h3>
                <p className="text-white/80 flex-grow">
                  Access and manage {sec.name.toLowerCase()} records and
                  operations
                </p>
                <div className="mt-4 flex justify-end">
                  <span className="text-white/90 hover:text-white transition">
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
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Quick Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold">1,248</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Active Officers</p>
              <p className="text-2xl font-bold">856</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <p className="text-sm text-gray-600">Pending Complaints</p>
              <p className="text-2xl font-bold">92</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <p className="text-sm text-gray-600">Urgent Cases</p>
              <p className="text-2xl font-bold">15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a2b4b] text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">Bangladesh Police</h3>
              <p className="text-sm opacity-80">
                Administrative Control System
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-300 transition">
                Help Desk
              </a>
              <a href="#" className="hover:text-blue-300 transition">
                User Manual
              </a>
              <a href="#" className="hover:text-blue-300 transition">
                Contact Support
              </a>
            </div>
          </div>
          <div className="border-t border-white/20 mt-6 pt-6 text-center text-sm opacity-80">
            © {new Date().getFullYear()} Bangladesh Police. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
