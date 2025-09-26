"use client";
import React, { useState } from "react";

export default function NewCases({ cases, onAssignCase, onViewDetails }) {
  const [assigningCase, setAssigningCase] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState("");

  const officers = [
    { id: 1, name: "মোঃ সোহেল রানা", rank: "কনস্টেবল" },
    { id: 2, name: "মোঃ জাহিদ হাসান", rank: "এএসআই" },
    { id: 3, name: "মোঃ রাজু আহমেদ", rank: "সাব-ইন্সপেক্টর" },
  ];

  const handleAssign = (caseId) => {
    if (selectedOfficer) {
      onAssignCase(caseId, selectedOfficer);
      setAssigningCase(null);
      setSelectedOfficer("");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">নতুন অভিযোগ সমূহ</h2>

      {cases.length > 0 ? (
        <div className="space-y-4">
          {cases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {caseItem.title}
                  </h3>
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
                      <span className="text-gray-600">অগ্রাধিকার:</span>
                      <span className="font-medium ml-2">
                        {caseItem.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {caseItem.description}
                  </p>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => onViewDetails(caseItem)}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition"
                  >
                    বিস্তারিত
                  </button>

                  {assigningCase === caseItem.id ? (
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedOfficer}
                        onChange={(e) => setSelectedOfficer(e.target.value)}
                        className="border border-gray-300 rounded text-sm px-2 py-1"
                      >
                        <option value="">অফিসার নির্বাচন</option>
                        {officers.map((officer) => (
                          <option key={officer.id} value={officer.name}>
                            {officer.name} ({officer.rank})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssign(caseItem.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                        disabled={!selectedOfficer}
                      >
                        নিয়োগ
                      </button>
                      <button
                        onClick={() => setAssigningCase(null)}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition"
                      >
                        বাতিল
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAssigningCase(caseItem.id)}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 transition"
                    >
                      অফিসার নিয়োগ
                    </button>
                  )}
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
          <p className="text-gray-500">কোনো নতুন অভিযোগ নেই</p>
        </div>
      )}
    </div>
  );
}
