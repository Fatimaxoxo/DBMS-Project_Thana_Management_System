"use client";
import React from "react";

export default function AssignedCases({
  cases,
  onViewDetails,
  onUpdateProgress,
}) {
  const getCaseStatusBadge = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      assigned: "bg-blue-100 text-blue-800",
      investigating: "bg-purple-100 text-purple-800",
      resolved: "bg-green-100 text-green-800",
      closed: "bg-gray-100 text-gray-800",
    };

    const statusLabels = {
      pending: "নতুন",
      assigned: "বরাদ্দকৃত",
      investigating: "তদন্তাধীন",
      resolved: "সমাধানকৃত",
      closed: "বন্ধ",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusLabels[status] || status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityColors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
      urgent: "bg-red-200 text-red-900",
    };

    const priorityLabels = {
      low: "কম",
      medium: "মাধ্যম",
      high: "উচ্চ",
      urgent: "জরুরি",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          priorityColors[priority] || "bg-gray-100 text-gray-800"
        }`}
      >
        {priorityLabels[priority] || priority}
      </span>
    );
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    if (percentage >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("bn-BD");
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              আমার বরাদ্দকৃত মামলা ({cases.length})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              🔍 তদন্তের জন্য বরাদ্দকৃত মামলাসমূহ - বিস্তারিত দেখুন ও অগ্রগতি
              আপডেট করুন
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              সর্বশেষ আপডেট: {new Date().toLocaleTimeString("bn-BD")}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-purple-50 to-blue-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                📋 মামলার তথ্য
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                👤 অভিযোগকারী
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                📊 অগ্রগতি
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                🔄 অবস্থা
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ⚡ অ্যাকশন
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cases.map((case_, index) => (
              <tr key={case_.case_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {case_.case_number}
                    </div>
                    <div className="text-sm text-gray-500">
                      {case_.crime_type}
                    </div>
                    <div className="text-xs text-gray-400">
                      {case_.incident_location}
                    </div>
                    <div className="mt-1 flex space-x-1">
                      {getPriorityBadge(case_.priority)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      বরাদ্দ:{" "}
                      {case_.assignment_date
                        ? formatDate(case_.assignment_date)
                        : "আজ"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {case_.user_name || "অজানা"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {case_.user_phone || "ফোন নেই"}
                  </div>
                  <div className="text-xs text-gray-400">
                    অভিযোগ #{case_.complaint_id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(
                          case_.progress_percentage || 0
                        )}`}
                        style={{
                          width: `${case_.progress_percentage || 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                      {case_.progress_percentage || 0}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {(() => {
                      if (case_.progress_percentage === 0)
                        return "এখনো শুরু হয়নি";
                      if (
                        case_.progress_percentage > 0 &&
                        case_.progress_percentage < 25
                      )
                        return "প্রাথমিক পর্যায়ে";
                      if (
                        case_.progress_percentage >= 25 &&
                        case_.progress_percentage < 50
                      )
                        return "চলমান";
                      if (
                        case_.progress_percentage >= 50 &&
                        case_.progress_percentage < 75
                      )
                        return "অগ্রসরমান";
                      if (
                        case_.progress_percentage >= 75 &&
                        case_.progress_percentage < 100
                      )
                        return "প্রায় সম্পন্ন";
                      if (case_.progress_percentage === 100) return "সম্পূর্ণ";
                      return "";
                    })()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="mb-1">{getCaseStatusBadge(case_.status)}</div>
                  <div className="text-xs text-gray-500">
                    {case_.updated_at &&
                      `শেষ আপডেট: ${formatDate(case_.updated_at)}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="space-y-2">
                    <button
                      onClick={() => onViewDetails(case_)}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                    >
                      🔍 বিস্তারিত ও আপডেট
                    </button>
                    {case_.status !== "resolved" && (
                      <button
                        onClick={() => onUpdateProgress(case_)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                      >
                        ⚡ দ্রুত আপডেট
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cases.length === 0 && (
          <div className="text-center py-16 text-gray-500 bg-gradient-to-b from-gray-50 to-white">
            <div className="text-8xl mb-6">�</div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700">
              কোনো মামলা বরাদ্দ নেই
            </h3>
            <p className="text-gray-600 mb-4">
              থানা অফিসার আপনাকে মামলা বরাদ্দ দিলে এখানে দেখাবে।
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              নতুন মামলার জন্য অপেক্ষা করুন
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Quick Stats */}
      {cases.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 px-6 py-6 border-t border-purple-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-4 text-center">
            📊 দ্রুত পরিসংখ্যান
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {cases.filter((c) => c.status === "assigned").length}
              </div>
              <div className="text-xs text-gray-600 font-medium">
                নতুন বরাদ্দ
              </div>
              <div className="text-xs text-blue-500 mt-1">🆕 Assigned</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {cases.filter((c) => c.status === "investigating").length}
              </div>
              <div className="text-xs text-gray-600 font-medium">তদন্তাধীন</div>
              <div className="text-xs text-purple-500 mt-1">🔍 Active</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {cases.filter((c) => c.status === "resolved").length}
              </div>
              <div className="text-xs text-gray-600 font-medium">সমাধানকৃত</div>
              <div className="text-xs text-green-500 mt-1">✅ Completed</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-100">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {Math.round(
                  cases.reduce(
                    (acc, c) => acc + (c.progress_percentage || 0),
                    0
                  ) / cases.length || 0
                )}
                %
              </div>
              <div className="text-xs text-gray-600 font-medium">
                গড় অগ্রগতি
              </div>
              <div className="text-xs text-orange-500 mt-1">📈 Average</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
