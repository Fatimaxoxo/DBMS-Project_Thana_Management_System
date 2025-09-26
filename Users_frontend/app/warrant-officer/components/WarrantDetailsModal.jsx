"use client";
import React, { useState } from "react";

const WarrantDetailsModal = ({ case_, onClose, onUpdateProgress }) => {
  const [progressPercentage, setProgressPercentage] = useState(
    case_?.progress_percentage || 0
  );
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await onUpdateProgress(case_.case_id, progressPercentage, notes);
      onClose();
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setIsUpdating(false);
    }
  };
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

        {/* Footer - Progress Update Form */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-t border-green-200 px-6 py-4">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            🔄 অগ্রগতি আপডেট করুন
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Progress Percentage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  অগ্রগতির শতাংশ: {progressPercentage}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercentage}
                  onChange={(e) =>
                    setProgressPercentage(parseInt(e.target.value))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>

                {/* Progress Status Indicator */}
                <div className="mt-2 text-sm">
                  <span className="font-medium">স্ট্যাটাস: </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      progressPercentage === 0
                        ? "bg-gray-100 text-gray-800"
                        : progressPercentage < 25
                        ? "bg-red-100 text-red-800"
                        : progressPercentage < 50
                        ? "bg-orange-100 text-orange-800"
                        : progressPercentage < 75
                        ? "bg-yellow-100 text-yellow-800"
                        : progressPercentage < 100
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {progressPercentage === 0
                      ? "এখনো শুরু হয়নি"
                      : progressPercentage < 25
                      ? "প্রাথমিক পর্যায়ে"
                      : progressPercentage < 50
                      ? "চলমান"
                      : progressPercentage < 75
                      ? "অগ্রসরমান"
                      : progressPercentage < 100
                      ? "প্রায় সম্পন্ন"
                      : "সম্পূর্ণ"}
                  </span>
                </div>
              </div>

              {/* Investigation Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  তদন্তের নোট / মন্তব্য
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="তদন্তের বিস্তারিত, প্রমাণ সংগ্রহের অবস্থা, পরবর্তী পদক্ষেপ ইত্যাদি লিখুন..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  এই নোট থানা অফিসার এবং ঊর্ধ্বতন কর্মকর্তারা দেখতে পাবেন
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className={`px-6 py-2 text-white rounded-lg transition-colors ${
                  isUpdating
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {isUpdating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    আপডেট করছে...
                  </div>
                ) : (
                  "অগ্রগতি আপডেট করুন"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WarrantDetailsModal;
