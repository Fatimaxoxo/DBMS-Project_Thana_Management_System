"use client";
import React, { useState } from "react";

export default function AssignOfficerModal({
  isOpen,
  onClose,
  case_,
  warrantOfficers,
  onAssign,
}) {
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [priorityNotes, setPriorityNotes] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedOfficer) {
      alert("অনুগ্রহ করে একজন ওয়ারেন্ট অফিসার নির্বাচন করুন");
      return;
    }

    setIsAssigning(true);
    try {
      await onAssign(case_.case_id, selectedOfficer, priorityNotes);
      onClose();
      setSelectedOfficer("");
      setPriorityNotes("");
    } catch (error) {
      console.error("Assignment failed:", error);
    } finally {
      setIsAssigning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              ওয়ারেন্ট অফিসার নিয়োগ
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-gray-900 mb-2">মামলার তথ্য</h3>
            <p className="text-sm text-gray-600">
              <strong>মামলা নং:</strong>{" "}
              {case_?.case_number || `CASE-${case_?.case_id}`}
            </p>
            <p className="text-sm text-gray-600">
              <strong>সারসংক্ষেপ:</strong> {case_?.summary}
            </p>
            <p className="text-sm text-gray-600">
              <strong>অগ্রাধিকার:</strong>{" "}
              {case_?.priority === "high"
                ? "উচ্চ"
                : case_?.priority === "medium"
                ? "মাধ্যম"
                : "নিম্ন"}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ওয়ারেন্ট অফিসার নির্বাচন করুন *
            </label>
            <select
              value={selectedOfficer}
              onChange={(e) => setSelectedOfficer(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- অফিসার নির্বাচন করুন --</option>
              {warrantOfficers.map((officer) => (
                <option key={officer.user_id} value={officer.user_id}>
                  {officer.name} ({officer.current_cases || 0} টি চলমান মামলা)
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              অগ্রাধিকারের নোট (ঐচ্ছিক)
            </label>
            <textarea
              value={priorityNotes}
              onChange={(e) => setPriorityNotes(e.target.value)}
              placeholder="বিশেষ নির্দেশনা বা অগ্রাধিকারের তথ্য লিখুন..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isAssigning}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              বাতিল
            </button>
            <button
              onClick={handleAssign}
              disabled={isAssigning || !selectedOfficer}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isAssigning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  নিয়োগ দিচ্ছি...
                </>
              ) : (
                "নিয়োগ দিন"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
