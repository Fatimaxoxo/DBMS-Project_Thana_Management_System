"use client";
import React from "react";

export default function CaseProgress({ cases, onUpdateProgress }) {
  const getProgressColor = (percentage) => {
    if (percentage >= 75) return "from-green-400 to-green-600";
    if (percentage >= 50) return "from-yellow-400 to-yellow-600";
    if (percentage >= 25) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  const getStatusIcon = (percentage) => {
    if (percentage === 100) return "✅";
    if (percentage >= 75) return "🟢";
    if (percentage >= 50) return "🟡";
    if (percentage >= 25) return "🟠";
    return "🔴";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("bn-BD");
  };

  const sortedCases = [...cases].sort((a, b) => {
    // Sort by priority (urgent first) then by progress
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff =
      (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    if (priorityDiff !== 0) return priorityDiff;
    return (a.progress_percentage || 0) - (b.progress_percentage || 0);
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          📊 মামলার অগ্রগতি ট্র্যাকিং
        </h2>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{cases.length}</div>
            <div className="text-sm opacity-90">মোট মামলা</div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">
              {cases.filter((c) => (c.progress_percentage || 0) < 50).length}
            </div>
            <div className="text-sm opacity-90">প্রাথমিক পর্যায়ে</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">
              {
                cases.filter(
                  (c) =>
                    (c.progress_percentage || 0) >= 50 &&
                    (c.progress_percentage || 0) < 100
                ).length
              }
            </div>
            <div className="text-sm opacity-90">চলমান</div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">
              {cases.filter((c) => (c.progress_percentage || 0) === 100).length}
            </div>
            <div className="text-sm opacity-90">সম্পূর্ণ</div>
          </div>
        </div>

        {/* Progress List */}
        <div className="space-y-4">
          {sortedCases.map((case_, index) => (
            <div
              key={case_.case_id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">
                      {getStatusIcon(case_.progress_percentage || 0)}
                    </span>
                    <h3 className="font-semibold text-gray-900">
                      {case_.case_number}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        case_.priority === "urgent"
                          ? "bg-red-100 text-red-800"
                          : case_.priority === "high"
                          ? "bg-orange-100 text-orange-800"
                          : case_.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {case_.priority === "urgent"
                        ? "জরুরি"
                        : case_.priority === "high"
                        ? "উচ্চ"
                        : case_.priority === "medium"
                        ? "মাধ্যম"
                        : "কম"}{" "}
                      অগ্রাধিকার
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {case_.crime_type} - {case_.incident_location}
                  </p>

                  <div className="text-xs text-gray-500">
                    বরাদ্দ:{" "}
                    {case_.assignment_date
                      ? formatDate(case_.assignment_date)
                      : "আজ"}{" "}
                    | অভিযোগকারী: {case_.user_name || "অজানা"}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {case_.progress_percentage || 0}%
                  </div>
                  <button
                    onClick={() => onUpdateProgress && onUpdateProgress(case_)}
                    className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded-full font-medium"
                  >
                    আপডেট করুন
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-700">
                    অগ্রগতি
                  </span>
                  <span className="text-xs text-gray-500">
                    {case_.progress_percentage === 0 && "এখনো শুরু হয়নি"}
                    {case_.progress_percentage > 0 &&
                      case_.progress_percentage < 25 &&
                      "প্রাথমিক"}
                    {case_.progress_percentage >= 25 &&
                      case_.progress_percentage < 50 &&
                      "চলমান"}
                    {case_.progress_percentage >= 50 &&
                      case_.progress_percentage < 75 &&
                      "অগ্রসরমান"}
                    {case_.progress_percentage >= 75 &&
                      case_.progress_percentage < 100 &&
                      "প্রায় সম্পন্ন"}
                    {case_.progress_percentage === 100 && "সম্পূর্ণ"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(
                      case_.progress_percentage || 0
                    )} transition-all duration-500 ease-out`}
                    style={{
                      width: `${case_.progress_percentage || 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Last Update Info */}
              {case_.investigation_notes && (
                <div className="bg-gray-50 rounded p-3 mt-3">
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    সর্বশেষ আপডেট:
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {case_.investigation_notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {cases.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium mb-2">কোনো মামলা নেই</h3>
            <p>
              আপনাকে মামলা বরাদ্দ দেওয়া হলে এখানে অগ্রগতি ট্র্যাক করতে পারবেন।
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {cases.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">⚡ দ্রুত কর্ম</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => {
                const pendingCases = cases.filter(
                  (c) => (c.progress_percentage || 0) === 0
                );
                if (pendingCases.length > 0 && onUpdateProgress) {
                  onUpdateProgress(pendingCases[0]);
                }
              }}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-center"
            >
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-sm font-medium text-blue-800">
                নতুন মামলা শুরু করুন
              </div>
            </button>

            <button
              onClick={() => {
                const inProgressCases = cases.filter(
                  (c) =>
                    (c.progress_percentage || 0) > 0 &&
                    (c.progress_percentage || 0) < 100
                );
                if (inProgressCases.length > 0 && onUpdateProgress) {
                  onUpdateProgress(inProgressCases[0]);
                }
              }}
              className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-center"
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-medium text-purple-800">
                চলমান আপডেট করুন
              </div>
            </button>

            <button
              onClick={() => {
                const urgentCases = cases.filter(
                  (c) =>
                    c.priority === "urgent" &&
                    (c.progress_percentage || 0) < 100
                );
                if (urgentCases.length > 0 && onUpdateProgress) {
                  onUpdateProgress(urgentCases[0]);
                }
              }}
              className="bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-4 text-center"
            >
              <div className="text-2xl mb-2">🚨</div>
              <div className="text-sm font-medium text-red-800">
                জরুরি মামলা দেখুন
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
