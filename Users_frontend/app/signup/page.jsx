"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
    thana_id: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock thana data - replace with actual API call
  const thanaOptions = [
    { thana_id: 1, name: "ধানমন্ডি থানা" },
    { thana_id: 2, name: "রমনা থানা" },
    { thana_id: 3, name: "গুলশান থানা" },
    { thana_id: 4, name: "ওয়ারী থানা" },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    if (!/^\d{11}$/.test(formData.phone)) {
      toast.error("১১ সংখ্যার সঠিক মোবাইল নম্বর দিন");
      return;
    }

    if ((formData.role === 'thana-officer' || formData.role === 'warrant-officer') && !formData.thana_id) {
      toast.error("অফিসার পদের জন্য থানা নির্বাচন করুন");
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        thana_id: formData.role === 'user' ? null : parseInt(formData.thana_id)
      };

      const response = await axios.post("http://localhost:4000/api/auth/signup", submitData);
      const data = response.data;

      if (data.user) {
        toast.success("সফলভাবে নিবন্ধন সম্পন্ন হয়েছে!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "নিবন্ধনে সমস্যা হয়েছে";
      toast.error(errorMessage);
      console.error("Signup error:", error);
    }

    setIsLoading(false);
  };

  const roleDescriptions = {
    user: "সাধারণ নাগরিক - অভিযোগ দাখিল করতে পারবেন এবং মামলার অগ্রগতি দেখতে পারবেন",
    "thana-officer": "থানা অফিসার - মামলা ব্যবস্থাপনা ও ওয়ারেন্ট অফিসার নিয়োগ দিতে পারবেন",
    "warrant-officer": "ওয়ারেন্ট অফিসার - বরাদ্দকৃত মামলার অগ্রগতি আপডেট করতে পারবেন"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">📝</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            নতুন একাউন্ট তৈরি করুন
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            অথবা{' '}
            <button
              onClick={() => router.push('/login')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              বিদ্যমান একাউন্টে লগইন করুন
            </button>
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                পূর্ণ নাম
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="আপনার পূর্ণ নাম"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                মোবাইল নম্বর
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="১১ সংখ্যার মোবাইল নম্বর"
                pattern="[0-9]{11}"
                title="১১ সংখ্যার মোবাইল নম্বর দিন"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                ব্যবহারকারীর ধরন
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
              >
                <option value="user">👤 সাধারণ ব্যবহারকারী</option>
                <option value="thana-officer">👮 থানা অফিসার</option>
                <option value="warrant-officer">🎖️ ওয়ারেন্ট অফিসার</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {roleDescriptions[formData.role]}
              </p>
            </div>

            {(formData.role === 'thana-officer' || formData.role === 'warrant-officer') && (
              <div>
                <label htmlFor="thana_id" className="block text-sm font-medium text-gray-700">
                  থানা নির্বাচন করুন
                </label>
                <select
                  id="thana_id"
                  name="thana_id"
                  value={formData.thana_id}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                >
                  <option value="">থানা নির্বাচন করুন</option>
                  {thanaOptions.map((thana) => (
                    <option key={thana.thana_id} value={thana.thana_id}>
                      {thana.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                minLength="6"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                minLength="6"
              />
            </div>

            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                আমি <a href="#" className="text-blue-600 hover:text-blue-500">শর্তাবলী</a> এবং <a href="#" className="text-blue-600 hover:text-blue-500">গোপনীয়তা নীতি</a> মেনে নিচ্ছি
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    নিবন্ধন হচ্ছে...
                  </div>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    নিবন্ধন করুন
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">অথবা</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => router.push('/')}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <span>হোম পেজে ফিরে যান</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}