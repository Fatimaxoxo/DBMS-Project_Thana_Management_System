"use client";
import React, { useState } from "react";

export default function WarrantDetailsModal({
  caseData,
  onClose,
  onUpdateProgress,
}) {
  const [progressUpdate, setProgressUpdate] = useState({
    progress: caseData?.progress || 0,
    notes: "",
    nextSteps: caseData?.nextSteps || "",
  });

  const handleProgressUpdate = () => {
    onUpdateProgress(caseData.id, progressUpdate);
    onClose();
  };

  if (!caseData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            কেসের বিস্তারিত তথ্য
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                মূল তথ্য
              </h3>

              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">শিরোনাম:</span>
                  <p className="font-medium">{caseData.title}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">অভিযোগকারী:</span>
                  <p className="font-medium">{caseData.complainant}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">ফোন নম্বর:</span>
                  <p className="font-medium">{caseData.phone}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">তারিখ:</span>
                  <p className="font-medium">{caseData.date}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">অ্যাসাইন তারিখ:</span>
                  <p className="font-medium">{caseData.assignedDate}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">অবস্থান:</span>
                  <p className="font-medium">{caseData.location}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">অগ্রাধিকার:</span>
                  <p className="font-medium">{caseData.priority}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">
                    অ্যাসাইন করেছেন:
                  </span>
                  <p className="font-medium">{caseData.assignedBy}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                তদন্ত তথ্য
              </h3>

              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">স্থিতি:</span>
                  <p className="font-medium">{caseData.status}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">পরবর্তী শুনানি:</span>
                  <p className="font-medium">{caseData.nextHearing}</p>
                </div>

                <div>
                  <span className="text-sm text-gray-600">প্রমাণ:</span>
                  <div className="mt-1">
                    {caseData.evidence.map((item, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-2 mb-2"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">তদন্ত অগ্রগতি</span>
                    <span className="text-sm font-medium">
                      {caseData.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${caseData.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">বিবরণ</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{caseData.description}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              গৃহীত পদক্ষেপ
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700">{caseData.actionsTaken}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              পরবর্তী পদক্ষেপ
            </h3>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-700">{caseData.nextSteps}</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              অগ্রগতি আপডেট
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  অগ্রগতি (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressUpdate.progress}
                  onChange={(e) =>
                    setProgressUpdate({
                      ...progressUpdate,
                      progress: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
                <div className="text-center mt-1">
                  <span className="text-sm font-medium">
                    {progressUpdate.progress}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  পরবর্তী পদক্ষেপ
                </label>
                <input
                  type="text"
                  value={progressUpdate.nextSteps}
                  onChange={(e) =>
                    setProgressUpdate({
                      ...progressUpdate,
                      nextSteps: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="পরবর্তী পদক্ষেপ লিখুন"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                নোট
              </label>
              <textarea
                value={progressUpdate.notes}
                onChange={(e) =>
                  setProgressUpdate({
                    ...progressUpdate,
                    notes: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="3"
                placeholder="আপনার নোট লিখুন..."
              ></textarea>
            </div>

            <button
              onClick={handleProgressUpdate}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              অগ্রগতি আপডেট করুন
            </button>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition mr-3"
          >
            বন্ধ করুন
          </button>
          <button
            onClick={handleProgressUpdate}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            সেভ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
