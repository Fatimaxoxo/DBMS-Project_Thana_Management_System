"use client";
import React from "react";

export default function CaseProgress({ cases, onViewDetails }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        কেস অগ্রগতি রিপোর্ট
      </h2>

      {cases.length > 0 ? (
        <div className="space-y-6">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {caseItem.title}
                  </h3>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">অগ্রগতি</p>
                      <p className="text-xl font-bold text-blue-700">
                        {caseItem.progress}%
                      </p>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">পরবর্তী শুনানি</p>
                      <p className="text-sm font-bold text-purple-700">
                        {caseItem.nextHearing}
                      </p>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">স্থিতি</p>
                      <p className="text-sm font-bold text-green-700">
                        {caseItem.status}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      গৃহীত পদক্ষেপ
                    </h4>
                    <p className="text-sm text-gray-600">
                      {caseItem.actionsTaken}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      পরবর্তী পদক্ষেপ
                    </h4>
                    <p className="text-sm text-gray-600">
                      {caseItem.nextSteps}
                    </p>
                  </div>
                </div>

                <div className="ml-4">
                  <button
                    onClick={() => onViewDetails(caseItem)}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm hover:bg-indigo-200 transition whitespace-nowrap"
                  >
                    বিস্তারিত দেখুন
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
          <p className="text-gray-500">কোনো কেসের অগ্রগতি রিপোর্ট নেই</p>
        </div>
      )}
    </div>
  );
}
