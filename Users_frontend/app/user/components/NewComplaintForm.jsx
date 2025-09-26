"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function NewComplaintForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    complaint_type: "",
    title: "",
    description: "",
    incident_date: "",
    location: "",
    suspect_info: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const complaintTypes = [
    { value: "theft", label: "চুরি" },
    { value: "assault", label: "মারামারি" },
    { value: "fraud", label: "জালিয়াতি" },
    { value: "missing_person", label: "গুম/অপহরণ" },
    { value: "property_damage", label: "সম্পদ ক্ষতি" },
    { value: "other", label: "অন্যান্য" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.complaint_type ||
      !formData.description ||
      !formData.incident_date ||
      !formData.location
    ) {
      toast.error("সকল প্রয়োজনীয় তথ্য পূরণ করুন");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));

      const complaintData = {
        title:
          formData.title ||
          `${
            complaintTypes.find((t) => t.value === formData.complaint_type)
              ?.label
          } অভিযোগ`,
        description: formData.description,
        complaint_type: formData.complaint_type,
        location: formData.location,
        incident_date: formData.incident_date + " 00:00:00",
        user_id: user.id,
      };

      const response = await axios.post(
        "http://localhost:4000/api/complaints",
        complaintData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("অভিযোগ সফলভাবে দাখিল হয়েছে");

      // Reset form
      setFormData({
        complaint_type: "",
        title: "",
        description: "",
        incident_date: "",
        location: "",
        suspect_info: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error(
        error.response?.data?.message || "অভিযোগ দাখিলে ত্রুটি হয়েছে"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-blue-100 mr-4">
          <span className="text-2xl">📝</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">নতুন অভিযোগ দাখিল</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              অভিযোগের ধরণ *
            </label>
            <select
              name="complaint_type"
              value={formData.complaint_type}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">অভিযোগের ধরণ নির্বাচন করুন</option>
              {complaintTypes.map((type, index) => (
                <option key={index} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ঘটনার তারিখ *
            </label>
            <input
              type="date"
              name="incident_date"
              value={formData.incident_date}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ঘটনাস্থল *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="ঘটনাস্থলের সম্পূর্ণ ঠিকানা লিখুন"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ঘটনার বিবরণ *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="ঘটনার সম্পূর্ণ বিবরণ লিখুন..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            সন্দেহভাজন ব্যক্তির তথ্য (যদি থাকে)
          </label>
          <textarea
            name="suspect_info"
            value={formData.suspect_info}
            onChange={handleInputChange}
            placeholder="সন্দেহভাজন ব্যক্তির নাম, ঠিকানা বা অন্যান্য তথ্য..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <span className="text-yellow-500 text-xl mr-2">⚠️</span>
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-1">
                গুরুত্বপূর্ণ তথ্য
              </h4>
              <p className="text-sm text-yellow-700">
                • সকল তথ্য সত্য এবং সঠিক তা নিশ্চিত করুন
                <br />• মিথ্যা তথ্য প্রদান আইনত দণ্ডনীয় অপরাধ
                <br />• জরুরি অবস্থায় ৯৯৯ নম্বরে কল করুন
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              setFormData({
                complaint_type: "",
                title: "",
                description: "",
                incident_date: "",
                location: "",
                suspect_info: "",
              });
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            রিসেট
          </button>
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>দাখিল হচ্ছে...</span>
              </>
            ) : (
              <>
                <span className="text-lg">📋</span>
                <span>অভিযোগ দাখিল করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
