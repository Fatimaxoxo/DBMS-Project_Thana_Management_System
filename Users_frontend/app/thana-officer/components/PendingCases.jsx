"use client";
import React from "react";

export default function PendingCases({ cases, onViewDetails }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        মুলতুবি অভিযোগ সমূহ
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
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
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
                  </div>

                  <div className="mt-2">
                    <span className="text-gray-600">নোট:</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {caseItem.notes}
                    </p>
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
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-500">কোনো মুলতুবি অভিযোগ নেই</p>
        </div>
      )}
    </div>
  );
}
