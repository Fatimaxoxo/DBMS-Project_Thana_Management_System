"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const services = [
    {
      title: "অভিযোগ দাখিল",
      description: "অপরাধের বিরুদ্ধে অভিযোগ দাখিল করুন এবং ন্যায়বিচার পান",
      icon: "📝",
      color: "bg-blue-500",
    },
    {
      title: "মামলার অগ্রগতি",
      description: "আপনার দাখিলকৃত মামলার বর্তমান অবস্থা জানুন",
      icon: "📊",
      color: "bg-green-500",
    },
    {
      title: "থানা সেবা",
      description: "নিকটস্থ থানার তথ্য এবং যোগাযোগের ঠিকানা পান",
      icon: "🏢",
      color: "bg-purple-500",
    },
    {
      title: "জরুরি সেবা",
      description: "জরুরি পরিস্থিতিতে তাৎক্ষণিক সহায়তা পান",
      icon: "🚨",
      color: "bg-red-500",
    },
  ];

  const handleLogin = () => {
    router.push("/login");
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🛡️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  বাংলাদেশ পুলিশ
                </h1>
                <p className="text-sm text-gray-600">জনগণের সেবায়</p>
              </div>
            </div>

            {/* Login/Signup Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                লগইন
              </button>
              <button
                onClick={handleSignup}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                নিবন্ধন করুন
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">ডিজিটাল</span> থানা ব্যবস্থাপনা
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
            আধুনিক প্রযুক্তির মাধ্যমে দ্রুত ও নির্ভরযোগ্য পুলিশি সেবা পান।
            অভিযোগ দাখিল থেকে শুরু করে মামলার সমাধান পর্যন্ত সব কিছু এক
            জায়গায়।
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleLogin}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              এখনই শুরু করুন
            </button>
            <button className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-50 transition-colors">
              আরও জানুন
            </button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-50 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              আমাদের সেবাসমূহ
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              জনগণের নিরাপত্তা ও ন্যায়বিচার নিশ্চিত করতে আমরা বিভিন্ন ধরনের
              সেবা প্রদান করি
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
              >
                <div
                  className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto`}
                >
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                কেন আমাদের সিস্টেম ব্যবহার করবেন?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      দ্রুত সেবা
                    </h3>
                    <p className="text-gray-600">
                      অনলাইনে তাৎক্ষণিক অভিযোগ দাখিল এবং দ্রুত সমাধান
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      স্বচ্ছতা
                    </h3>
                    <p className="text-gray-600">
                      মামলার অগ্রগতি রিয়েল টাইমে ট্র্যাক করুন
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      নিরাপত্তা
                    </h3>
                    <p className="text-gray-600">
                      আপনার তথ্য সম্পূর্ণ সুরক্ষিত এবং গোপনীয়
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      ২৪/৭ সেবা
                    </h3>
                    <p className="text-gray-600">যেকোনো সময় জরুরি সেবা পান</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/banner1.png"
                alt="Police Service"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
              <div className="absolute inset-0 bg-blue-600 opacity-10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              আমাদের সাফল্যের পরিসংখ্যান
            </h2>
            <p className="text-xl opacity-90">
              জনগণের আস্থা ও সেবার মানই আমাদের গর্ব
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">১২,৪৮০+</div>
              <div className="text-lg opacity-90">সমাধানকৃত মামলা</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">৮৫৬</div>
              <div className="text-lg opacity-90">সক্রিয় অফিসার</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">৯৮%</div>
              <div className="text-lg opacity-90">সন্তুষ্ট নাগরিক</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">২৪/৭</div>
              <div className="text-lg opacity-90">জরুরি সেবা</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            আজই যোগ দিন আমাদের সাথে
          </h2>
          <p className="text-xl mb-8 opacity-90">
            একটি নিরাপদ ও ন্যায়ভিত্তিক সমাজ গড়তে আমাদের সাথে অংশীদার হন
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSignup}
              className="px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              নিবন্ধন করুন
            </button>
            <button
              onClick={handleLogin}
              className="px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              লগইন করুন
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🛡️</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">বাংলাদেশ পুলিশ</h3>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                জনগণের নিরাপত্তা ও ন্যায়বিচার নিশ্চিত করাই আমাদের মূল লক্ষ্য।
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">দ্রুত লিংক</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    অভিযোগ দাখিল
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    মামলার অগ্রগতি
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    থানা তালিকা
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    জরুরি যোগাযোগ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">সহায়তা</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    সাহায্য কেন্দ্র
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    ব্যবহার নির্দেশিকা
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    যোগাযোগ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    প্রায়শই জিজ্ঞাসা
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">যোগাযোগ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📧 info@police.gov.bd</li>
                <li>📞 ৯৯৯ (জরুরি)</li>
                <li>📞 ০২-৯৫৬২৮৫৪</li>
                <li>📍 ঢাকা মেট্রোপলিটন পুলিশ</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; ২০২৪ বাংলাদেশ পুলিশ। সকল অধিকার সংরক্ষিত।</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
