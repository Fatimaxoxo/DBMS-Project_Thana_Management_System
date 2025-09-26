"use client";
import React from "react";

export default function OngoingCases({ cases, onViewDetails }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        চলমান অভিযোগ সমূহ
      </h2>

      {cases.length > 0 ? (
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">
                      {caseItem.title}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {caseItem.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-600">অভিযোগকারী:</span>
                      <span className="font-medium ml-2">
                        {caseItem.complainant}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">ফোন:</span>
                      <span className="font-medium ml-2">{caseItem.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">তারিখ:</span>
                      <span className="font-medium ml-2">{caseItem.date}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">দায়িত্বপ্রাপ্ত:</span>
                      <span className="font-medium ml-2">
                        {caseItem.assignedTo}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">পরবর্তী শুনানি:</span>
                      <span className="font-medium ml-2">
                        {caseItem.nextHearing}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">
                        তদন্ত অগ্রগতি
                      </span>
                      <span className="text-sm font-medium">
                        {caseItem.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${caseItem.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="ml-4">
                  <button
                    onClick={() => onViewDetails(caseItem)}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition"
                  >
                    বিস্তারিত
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-500">কোনো চলমান অভিযোগ নেই</p>
        </div>
      )}
    </div>
  );
}
