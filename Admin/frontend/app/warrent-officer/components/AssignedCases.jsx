"use client";
import React from "react";

export default function AssignedCases({
  cases,
  onViewDetails,
  onUpdateProgress,
}) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "উচ্চ":
        return "bg-red-100 text-red-800";
      case "মাধ্যম":
        return "bg-yellow-100 text-yellow-800";
      case "নিম্ন":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "চলমান তদন্ত":
        return "bg-blue-100 text-blue-800";
      case "প্রাথমিক তদন্ত":
        return "bg-purple-100 text-purple-800";
      case "সম্পন্ন":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        আপনার অ্যাসাইনকৃত কেসসমূহ
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
                    <div className="flex space-x-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                          caseItem.priority
                        )}`}
                      >
                        {caseItem.priority}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                          caseItem.status
                        )}`}
                      >
                        {caseItem.status}
                      </span>
                    </div>
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
                      <span className="text-gray-600">অ্যাসাইন তারিখ:</span>
                      <span className="font-medium ml-2">
                        {caseItem.assignedDate}
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
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${caseItem.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {caseItem.description}
                  </p>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => onViewDetails(caseItem)}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-sm hover:bg-indigo-200 transition whitespace-nowrap"
                  >
                    বিস্তারিত দেখুন
                  </button>
                  <button
                    onClick={() =>
                      onUpdateProgress(caseItem.id, {
                        progress: caseItem.progress + 10,
                      })
                    }
                    className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 transition whitespace-nowrap"
                  >
                    অগ্রগতি আপডেট
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500">আপনাকে কোনো কেস অ্যাসাইন করা হয়নি</p>
        </div>
      )}
    </div>
  );
}
