"use client";
import React, { useState } from "react";

export default function CaseManagement({
  cases,
  warrantOfficers,
  onAssignOfficer,
  onViewDetails,
}) {
  const [selectedCase, setSelectedCase] = useState(null);
  const [assigningCase, setAssigningCase] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [priorityNotes, setPriorityNotes] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssignSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOfficer) {
      alert("ওয়ারেন্ট অফিসার নির্বাচন করুন");
      return;
    }

    setIsAssigning(true);
    try {
      await onAssignOfficer(
        assigningCase.case_id,
        selectedOfficer,
        priorityNotes
      );
      setAssigningCase(null);
      setSelectedOfficer("");
      setPriorityNotes("");
    } catch (error) {
      console.error("Assignment error:", error);
    } finally {
      setIsAssigning(false);
    }
  };

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

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            মামলা ব্যবস্থাপনা ({cases.length})
          </h2>
          <div className="text-sm text-gray-500">
            🔔 নতুন মামলা গুলো এখানে দেখুন
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                মামলা তথ্য
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                অভিযোগকারী
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                অবস্থা
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ওয়ারেন্ট অফিসার
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                অ্যাকশন
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
                      {case_.crime_type} - {case_.incident_location}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(case_.created_at).toLocaleDateString("bn-BD")}
                    </div>
                    <div className="mt-1">
                      {getPriorityBadge(case_.priority)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {case_.user_name || "অজানা"}
                  </div>
                  <div className="text-sm text-gray-500">
                    অভিযোগ #{case_.complaint_id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="mb-1">{getCaseStatusBadge(case_.status)}</div>
                  <div className="text-xs text-gray-500">
                    অগ্রগতি: {case_.progress_percentage || 0}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {case_.warrant_officer_name ? (
                    <div className="text-sm text-gray-900">
                      {case_.warrant_officer_name}
                    </div>
                  ) : (
                    <div className="text-sm text-red-500">যুক্ত করুন</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-1">
                  <button
                    onClick={() => onViewDetails(case_)}
                    className="text-blue-600 hover:text-blue-900 block"
                  >
                    বিস্তারিত
                  </button>
                  {!case_.assigned_warrant_officer_id && (
                    <button
                      onClick={() => setAssigningCase(case_)}
                      className="text-green-600 hover:text-green-900 block"
                    >
                      অফিসার নিয়োগ
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cases.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-lg font-medium mb-2">কোনো মামলা নেই</h3>
            <p>নতুন অভিযোগ আসলে এখানে দেখাবে।</p>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {assigningCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              ওয়ারেন্ট অফিসার নিয়োগ
            </h3>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium">মামলা: {assigningCase.case_number}</p>
              <p className="text-sm text-gray-600">
                {assigningCase.crime_type}
              </p>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ওয়ারেন্ট অফিসার নির্বাচন করুন *
                </label>
                <select
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">অফিসার নির্বাচন করুন</option>
                  {warrantOfficers.map((officer) => (
                    <option key={officer.user_id} value={officer.user_id}>
                      {officer.name} - {officer.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  অগ্রাধিকার নোট (ঐচ্ছিক)
                </label>
                <textarea
                  value={priorityNotes}
                  onChange={(e) => setPriorityNotes(e.target.value)}
                  placeholder="বিশেষ নির্দেশনা বা অগ্রাধিকার সম্পর্কে লিখুন..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setAssigningCase(null);
                    setSelectedOfficer("");
                    setPriorityNotes("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isAssigning}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                  disabled={isAssigning}
                >
                  {isAssigning ? "নিয়োগ হচ্ছে..." : "নিয়োগ দিন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
