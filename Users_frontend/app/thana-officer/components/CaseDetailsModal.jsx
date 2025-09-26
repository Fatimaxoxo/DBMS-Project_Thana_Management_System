"use client";
import React from "react";

export default function CaseDetailsModal({ case_, onClose }) {
  if (!case_) return null;

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
        className={`px-3 py-1 rounded-full text-sm font-medium ${
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
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          priorityColors[priority] || "bg-gray-100 text-gray-800"
        }`}
      >
        {priorityLabels[priority] || priority}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            মামলার বিস্তারিত তথ্য
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Case Header Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {case_.case_number}
                </h3>
                <p className="text-gray-600">অভিযোগ #{case_.complaint_id}</p>
              </div>
              <div className="flex space-x-2">
                {getCaseStatusBadge(case_.status)}
                {getPriorityBadge(case_.priority)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">অভিযোগের ধরন</p>
                <p className="font-medium">{case_.crime_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">অগ্রগতি</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${case_.progress_percentage || 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">
                    {case_.progress_percentage || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Case Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  📋 মামলার তথ্য
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">মামলা নম্বর:</span>
                    <p className="font-medium">{case_.case_number}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">শুরুর তারিখ:</span>
                    <p className="font-medium">
                      {formatDate(case_.start_date)}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">ঘটনার স্থান:</span>
                    <p className="font-medium">
                      {case_.incident_location || "উল্লেখ নেই"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">ঘটনার তারিখ:</span>
                    <p className="font-medium">
                      {case_.incident_date
                        ? formatDate(case_.incident_date)
                        : "উল্লেখ নেই"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  👤 অভিযোগকারীর তথ্য
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">নাম:</span>
                    <p className="font-medium">
                      {case_.user_name || "তথ্য নেই"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">ফোন:</span>
                    <p className="font-medium">
                      {case_.user_phone || "তথ্য নেই"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  👮 দায়িত্বপ্রাপ্ত অফিসার
                </h4>
                {case_.warrant_officer_name ? (
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">
                        ওয়ারেন্ট অফিসার:
                      </span>
                      <p className="font-medium">
                        {case_.warrant_officer_name}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">
                        নিয়োগের তারিখ:
                      </span>
                      <p className="font-medium">
                        {case_.assignment_date
                          ? formatDate(case_.assignment_date)
                          : "তথ্য নেই"}
                      </p>
                    </div>
                    {case_.priority_notes && (
                      <div>
                        <span className="text-sm text-gray-500">
                          অগ্রাধিকার নোট:
                        </span>
                        <p className="font-medium bg-yellow-50 p-2 rounded">
                          {case_.priority_notes}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-2">👤</div>
                    <p className="text-gray-500">
                      এখনো কোনো ওয়ারেন্ট অফিসার নিয়োগ দেওয়া হয়নি
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  📊 মামলার অবস্থা
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      বর্তমান অবস্থা:
                    </span>
                    {getCaseStatusBadge(case_.status)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">অগ্রাধিকার:</span>
                    {getPriorityBadge(case_.priority)}
                  </div>
                  <div>
                    <span className="text-sm text-gray-500 block mb-1">
                      সম্পূর্ণতা:
                    </span>
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${case_.progress_percentage || 0}%`,
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {case_.progress_percentage || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Case Description */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              📝 অভিযোগের বিবরণ
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium mb-2">{case_.complaint_title}</h5>
              <p className="text-gray-700 leading-relaxed">
                {case_.complaint_description || "বিবরণ পাওয়া যায়নি"}
              </p>
            </div>
          </div>

          {/* Investigation Notes (if any) */}
          {case_.investigation_notes && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                🔍 তদন্তের নোট
              </h4>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  {case_.investigation_notes}
                </p>
              </div>
            </div>
          )}

          {/* Timeline would go here */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              ⏰ মামলার সময়রেখা
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
                <div>
                  <p className="font-medium">মামলা তৈরি</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(case_.created_at)}
                  </p>
                </div>
              </div>
              {case_.assignment_date && (
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="font-medium">ওয়ারেন্ট অফিসার নিয়োগ</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(case_.assignment_date)}
                    </p>
                  </div>
                </div>
              )}
              {case_.progress_percentage > 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1.5"></div>
                  <div>
                    <p className="font-medium">তদন্ত শুরু</p>
                    <p className="text-sm text-gray-500">
                      অগ্রগতি: {case_.progress_percentage}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
