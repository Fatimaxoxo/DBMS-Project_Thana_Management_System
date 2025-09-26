"use client";
import React from "react";

export default function CaseDetailsModal({ caseData, onClose }) {
  if (!caseData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            অভিযোগের বিস্তারিত
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                {caseData.location && (
                  <div>
                    <span className="text-sm text-gray-600">স্থান:</span>
                    <p className="font-medium">{caseData.location}</p>
                  </div>
                )}

                {caseData.priority && (
                  <div>
                    <span className="text-sm text-gray-600">অগ্রাধিকার:</span>
                    <p className="font-medium">{caseData.priority}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                অতিরিক্ত তথ্য
              </h3>

              <div className="space-y-3">
                {caseData.assignedTo && (
                  <div>
                    <span className="text-sm text-gray-600">
                      দায়িত্বপ্রাপ্ত অফিসার:
                    </span>
                    <p className="font-medium">{caseData.assignedTo}</p>
                  </div>
                )}

                {caseData.status && (
                  <div>
                    <span className="text-sm text-gray-600">স্থিতি:</span>
                    <p className="font-medium">{caseData.status}</p>
                  </div>
                )}

                {caseData.nextHearing && (
                  <div>
                    <span className="text-sm text-gray-600">
                      পরবর্তী শুনানি:
                    </span>
                    <p className="font-medium">{caseData.nextHearing}</p>
                  </div>
                )}

                {caseData.progress && (
                  <div>
                    <span className="text-sm text-gray-600">অগ্রগতি:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${caseData.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {caseData.progress}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">বিবরণ</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{caseData.description}</p>
            </div>
          </div>

          {caseData.notes && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">নোট</h3>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-700">{caseData.notes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
