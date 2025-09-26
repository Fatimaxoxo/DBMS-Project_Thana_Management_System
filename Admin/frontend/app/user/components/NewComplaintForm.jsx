"use client";
import React, { useState } from "react";

export default function NewComplaintForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;
    onSubmit({
      title,
      description,
      category: category || "সাধারণ",
      date: new Date().toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
    setTitle("");
    setDescription("");
    setCategory("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-blue-600 mr-2"
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
        নতুন অভিযোগ দাখিল করুন
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            অভিযোগের শিরোনাম
          </label>
          <input
            type="text"
            placeholder="অভিযোগের শিরোনাম লিখুন"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            অভিযোগের ধরণ
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">অভিযোগের ধরণ নির্বাচন করুন</option>
            <option value="অপরাধ">অপরাধ সংক্রান্ত</option>
            <option value="উপদ্রব">উপদ্রব</option>
            <option value="সেবা">সেবা সংক্রান্ত</option>
            <option value="অন্যান্য">অন্যান্য</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            অভিযোগের বিবরণ
          </label>
          <textarea
            placeholder="অভিযোগের সম্পূর্ণ বিবরণ লিখুন"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center justify-center space-x-2 w-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clipRule="evenodd"
            />
          </svg>
          <span>অভিযোগ দাখিল করুন</span>
        </button>
      </form>
    </div>
  );
}
