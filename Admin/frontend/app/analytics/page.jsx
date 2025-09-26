"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

export default function AnalyticsPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [crimeAnalytics, setCrimeAnalytics] = useState(null);
  const [officerAnalytics, setOfficerAnalytics] = useState(null);
  const [selectedThana, setSelectedThana] = useState(null);
  const [thanaAnalytics, setThanaAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboardRes = await fetch(
        "http://localhost:4000/api/analytics/dashboard"
      );
      if (!dashboardRes.ok) throw new Error("Failed to fetch dashboard data");
      const dashboardData = await dashboardRes.json();
      setDashboardData(dashboardData.data);

      const crimeRes = await fetch("http://localhost:4000/api/analytics/crime");
      if (!crimeRes.ok) throw new Error("Failed to fetch crime data");
      const crimeData = await crimeRes.json();
      setCrimeAnalytics(crimeData.data);

      const officerRes = await fetch(
        "http://localhost:4000/api/analytics/officers"
      );
      if (!officerRes.ok) throw new Error("Failed to fetch officer data");
      const officerData = await officerRes.json();
      setOfficerAnalytics(officerData.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchThanaAnalytics = async (thanaId) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/analytics/thana/${thanaId}`
      );
      const data = await res.json();
      setThanaAnalytics(data.data);
      setSelectedThana(thanaId);
    } catch (error) {
      console.error("Error fetching thana analytics:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            onClick={fetchAllAnalytics}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Thana Management Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive statistical analysis and insights
            </p>
          </div>
          <a
            href="/"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            ← Back to Home
          </a>
        </div>

        <div className="flex space-x-1 mb-8 bg-gray-200 p-1 rounded-lg">
          {[
            { id: "dashboard", label: "Dashboard" },
            { id: "crime", label: "Crime Analytics" },
            { id: "thana", label: "Thana Analysis" },
            { id: "officers", label: "Officer Performance" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && dashboardData && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {[
                {
                  label: "Total Thanas",
                  value: dashboardData.totals.thanas,
                  icon: "🏢",
                  color: "bg-blue-500",
                },
                {
                  label: "Total Officers",
                  value: dashboardData.totals.officers,
                  icon: "👮",
                  color: "bg-green-500",
                },
                {
                  label: "Total Crimes",
                  value: dashboardData.totals.crimes,
                  icon: "🚨",
                  color: "bg-red-500",
                },
                {
                  label: "Total Complaints",
                  value: dashboardData.totals.complaints,
                  icon: "📋",
                  color: "bg-yellow-500",
                },
                {
                  label: "Total Cases",
                  value: dashboardData.totals.cases,
                  icon: "⚖️",
                  color: "bg-purple-500",
                },
                {
                  label: "Total Victims",
                  value: dashboardData.totals.victims,
                  icon: "👥",
                  color: "bg-indigo-500",
                },
              ].map((metric, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center">
                    <div
                      className={`${metric.color} p-3 rounded-lg text-white text-2xl`}
                    >
                      {metric.icon}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        {metric.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {metric.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* FIXED: Crime Types Distribution with proper field name */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Crime Types Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.distributions.crimeTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ crime_type, percent }) =>
                        `${crime_type} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {dashboardData.distributions.crimeTypes.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Cases"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Case Status Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.distributions.caseStatuses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Crime Trends (Last 12 Months)
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={dashboardData.trends.crimeMonthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month_name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Thana-wise Statistics
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thana Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Officers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crimes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Complaints
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cases
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.thanaStats.slice(0, 10).map((thana) => (
                      <tr key={thana.thana_id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {thana.thana_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {thana.officer_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {thana.crime_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {thana.complaint_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {thana.case_count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                          <button
                            onClick={() => {
                              fetchThanaAnalytics(thana.thana_id);
                              setActiveTab("thana");
                            }}
                            className="hover:text-blue-900"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Crime Analytics Tab */}
        {activeTab === "crime" && crimeAnalytics && (
          <div className="space-y-8">
            {/* Quick Crime Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-lg text-white">
                <div className="text-3xl mb-2">🚨</div>
                <div className="text-2xl font-bold">
                  {crimeAnalytics.crimeSeverity?.reduce(
                    (sum, item) => sum + item.count,
                    0
                  ) || 0}
                </div>
                <div className="text-red-100">Total Crimes</div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-lg text-white">
                <div className="text-3xl mb-2">🔍</div>
                <div className="text-2xl font-bold">
                  {crimeAnalytics.suspectAnalysis?.length || 0}
                </div>
                <div className="text-orange-100">Known Suspects</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                <div className="text-3xl mb-2">📍</div>
                <div className="text-2xl font-bold">
                  {crimeAnalytics.locationAnalysis?.length || 0}
                </div>
                <div className="text-purple-100">Crime Hotspots</div>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 rounded-lg text-white">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold">
                  {crimeAnalytics.crimeSeverity?.length || 0}
                </div>
                <div className="text-indigo-100">Crime Types</div>
              </div>
            </div>

            {/* Crime Severity Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Crime Severity Analysis
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={crimeAnalytics.crimeSeverity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="crime_type"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      name === "count" ? "Total Cases" : "Percentage",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Cases Count" />
                  <Bar dataKey="percentage" fill="#82ca9d" name="Percentage" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Location and Time Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Top Crime Hotspots
                </h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {crimeAnalytics.locationAnalysis
                    .slice(0, 15)
                    .map((location, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {location.last_seen_location}
                          </p>
                          <p
                            className="text-sm text-gray-600 truncate"
                            title={location.crime_types}
                          >
                            {location.crime_types
                              .split(",")
                              .slice(0, 3)
                              .join(", ")}
                            {location.crime_types.split(",").length > 3 &&
                              "..."}
                          </p>
                        </div>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          {location.count} crimes
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Crime Pattern by Day
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={crimeAnalytics.timeAnalysis}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day_of_week" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Seasonal and Suspect Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Seasonal Crime Pattern
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={crimeAnalytics.seasonalAnalysis}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ quarter_name, percent }) =>
                        `${quarter_name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {crimeAnalytics.seasonalAnalysis.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Cases"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Repeat Offenders</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {crimeAnalytics.suspectAnalysis
                    .slice(0, 10)
                    .map((suspect, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {suspect.suspects}
                          </p>
                          <p className="text-sm text-gray-600">
                            {suspect.crime_types}
                          </p>
                        </div>
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                          {suspect.count} crimes
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Crime Types Breakdown */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Detailed Crime Types Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={crimeAnalytics.crimeSeverity}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ crime_type, percent }) =>
                      `${crime_type} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {crimeAnalytics.crimeSeverity.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, "Cases"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Thana Analysis Tab */}
        {activeTab === "thana" && (
          <div className="space-y-8">
            {!selectedThana ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-semibold mb-4">
                  Select a Thana for Detailed Analysis
                </h3>
                <p className="text-gray-600 mb-6">
                  Click on any thana below to view comprehensive analytics
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {dashboardData?.thanaStats.map((thana) => (
                    <button
                      key={thana.thana_id}
                      onClick={() => fetchThanaAnalytics(thana.thana_id)}
                      className="p-4 border-2 border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all transform hover:scale-105"
                    >
                      <div className="text-2xl mb-2">🏢</div>
                      <h4 className="font-semibold text-gray-800">
                        {thana.thana_name}
                      </h4>
                      <div className="text-sm text-gray-600 mt-2 space-y-1">
                        <p>{thana.crime_count} crimes</p>
                        <p>{thana.officer_count} officers</p>
                        <p>{thana.case_count} cases</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              thanaAnalytics && (
                <div className="space-y-6">
                  {/* Thana Header */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {thanaAnalytics.thanaDetails.name}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          📍 {thanaAnalytics.thanaDetails.address}
                        </p>
                        <p className="text-gray-600">
                          📞 {thanaAnalytics.thanaDetails.contact}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedThana(null)}
                          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                        >
                          ← Back to Selection
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats for Selected Thana */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-500 text-white p-4 rounded-lg">
                      <div className="text-2xl">👮</div>
                      <div className="text-xl font-bold">
                        {thanaAnalytics.officers.length}
                      </div>
                      <div className="text-blue-100">Officers</div>
                    </div>
                    <div className="bg-red-500 text-white p-4 rounded-lg">
                      <div className="text-2xl">🚨</div>
                      <div className="text-xl font-bold">
                        {thanaAnalytics.recentCrimes.length}
                      </div>
                      <div className="text-red-100">Recent Crimes</div>
                    </div>
                    <div className="bg-green-500 text-white p-4 rounded-lg">
                      <div className="text-2xl">✅</div>
                      <div className="text-xl font-bold">
                        {thanaAnalytics.statistics.caseStats.find(
                          (s) => s.status === "Closed"
                        )?.count || 0}
                      </div>
                      <div className="text-green-100">Closed Cases</div>
                    </div>
                    <div className="bg-yellow-500 text-white p-4 rounded-lg">
                      <div className="text-2xl">⏳</div>
                      <div className="text-xl font-bold">
                        {thanaAnalytics.statistics.caseStats.reduce(
                          (sum, item) => sum + item.count,
                          0
                        )}
                      </div>
                      <div className="text-yellow-100">Total Cases</div>
                    </div>
                  </div>

                  {/* Officers List */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">
                      👮 Assigned Officers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {thanaAnalytics.officers.map((officer) => (
                        <div
                          key={officer.officer_id}
                          className="border-2 border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 p-2 rounded-full">
                              <div className="text-blue-600 text-lg">👮</div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">
                                {officer.name}
                              </h4>
                              <p className="text-sm text-blue-600 font-medium">
                                {officer.grade}
                              </p>
                              <p className="text-sm text-gray-600">
                                {officer.email}
                              </p>
                              <p className="text-sm text-gray-600">
                                {officer.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Statistics Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-4">
                        Crime Types in This Thana
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={
                              thanaAnalytics.statistics.crimeTypeDistribution
                            }
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ crime_type, percent }) =>
                              `${crime_type} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {thanaAnalytics.statistics.crimeTypeDistribution.map(
                              (entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip formatter={(value) => [value, "Cases"]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-4">
                        Case Status Distribution
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={thanaAnalytics.statistics.caseStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="status" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#00C49F" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Monthly Trends */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">
                      Crime Trends in This Thana
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={thanaAnalytics.statistics.monthlyTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month_name" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#8884d8"
                          fill="#8884d8"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Recent Crimes Table */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">
                      🚨 Recent Crimes
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Crime Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Suspects
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {thanaAnalytics.recentCrimes.map((crime) => (
                            <tr
                              key={crime.crime_id}
                              className="hover:bg-gray-50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    crime.crime_type === "Murder"
                                      ? "bg-red-100 text-red-800"
                                      : crime.crime_type === "Theft"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : crime.crime_type === "Robbery"
                                      ? "bg-orange-100 text-orange-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {crime.crime_type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {crime.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {crime.last_seen_location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(crime.date).toLocaleDateString(
                                  "en-GB"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {crime.suspects}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                                  Under Investigation
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Officer Performance Tab */}
        {activeTab === "officers" && officerAnalytics && (
          <div className="space-y-8">
            {/* Officer Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg text-white">
                <div className="text-3xl mb-2">👮</div>
                <div className="text-2xl font-bold">
                  {officerAnalytics.officerCaseLoad?.length || 0}
                </div>
                <div className="text-green-100">Total Officers</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg text-white">
                <div className="text-3xl mb-2">⚖️</div>
                <div className="text-2xl font-bold">
                  {officerAnalytics.officerCaseLoad?.reduce(
                    (sum, officer) => sum + officer.total_cases,
                    0
                  ) || 0}
                </div>
                <div className="text-blue-100">Total Cases</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg text-white">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-2xl font-bold">
                  {officerAnalytics.officerCaseLoad?.reduce(
                    (sum, officer) => sum + officer.closed_cases,
                    0
                  ) || 0}
                </div>
                <div className="text-purple-100">Closed Cases</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg text-white">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-2xl font-bold">
                  {officerAnalytics.officerCaseLoad?.length
                    ? (
                        (officerAnalytics.officerCaseLoad.reduce(
                          (sum, officer) => sum + officer.closed_cases,
                          0
                        ) /
                          officerAnalytics.officerCaseLoad.reduce(
                            (sum, officer) => sum + officer.total_cases,
                            0
                          )) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>
                <div className="text-yellow-100">Avg Success Rate</div>
              </div>
            </div>

            {/* Officer Grade Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Officer Grade Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={officerAnalytics.gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ grade, percent }) =>
                        `${grade} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {officerAnalytics.gradeDistribution.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip formatter={(value) => [value, "Officers"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Thana-wise Officer Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={officerAnalytics.thanaDistribution.slice(0, 10)}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="thana_name"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="officer_count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Performing Officers */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                🏆 Top Performing Officers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {officerAnalytics.officerCaseLoad
                  .filter((officer) => officer.total_cases > 0)
                  .sort(
                    (a, b) =>
                      b.closed_cases / b.total_cases -
                      a.closed_cases / a.total_cases
                  )
                  .slice(0, 6)
                  .map((officer, index) => (
                    <div
                      key={officer.officer_id}
                      className="border-2 border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-600"
                              : index === 1
                              ? "bg-gray-100 text-gray-600"
                              : index === 2
                              ? "bg-orange-100 text-orange-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <div className="text-lg">
                            {index === 0
                              ? "🥇"
                              : index === 1
                              ? "🥈"
                              : index === 2
                              ? "🥉"
                              : "👮"}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {officer.name}
                          </h4>
                          <p className="text-sm text-blue-600 font-medium">
                            {officer.grade}
                          </p>
                          <p className="text-xs text-gray-500">
                            {officer.thana_name}
                          </p>
                          <p className="text-sm font-medium text-green-600">
                            {(
                              (officer.closed_cases / officer.total_cases) *
                              100
                            ).toFixed(1)}
                            % Success Rate
                          </p>
                          <p className="text-xs text-gray-600">
                            {officer.closed_cases}/{officer.total_cases} cases
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Officer Performance Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                📊 Detailed Officer Performance
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Officer Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thana
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Cases
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Closed Cases
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Open Cases
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Under Investigation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Success Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {officerAnalytics.officerCaseLoad.map((officer) => {
                      const successRate =
                        officer.total_cases > 0
                          ? (officer.closed_cases / officer.total_cases) * 100
                          : 0;
                      return (
                        <tr
                          key={officer.officer_id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded-full mr-3">
                                <div className="text-blue-600 text-sm">👮</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {officer.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                officer.grade === "Inspector"
                                  ? "bg-blue-100 text-blue-800"
                                  : officer.grade === "Sub-Inspector"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {officer.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {officer.thana_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {officer.total_cases}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                            {officer.closed_cases}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            {officer.open_cases}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                            {officer.investigating_cases}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span
                              className={`${
                                successRate >= 80
                                  ? "text-green-600"
                                  : successRate >= 60
                                  ? "text-yellow-600"
                                  : "text-red-600"
                              }`}
                            >
                              {successRate.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                successRate >= 80
                                  ? "bg-green-100 text-green-800"
                                  : successRate >= 60
                                  ? "bg-yellow-100 text-yellow-800"
                                  : successRate >= 40
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {successRate >= 80
                                ? "Excellent"
                                : successRate >= 60
                                ? "Good"
                                : successRate >= 40
                                ? "Average"
                                : "Needs Improvement"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Metrics Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">
                Case Resolution Performance by Grade
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={officerAnalytics.gradeDistribution.map((grade) => {
                    const officersOfGrade =
                      officerAnalytics.officerCaseLoad.filter(
                        (officer) => officer.grade === grade.grade
                      );
                    const totalCases = officersOfGrade.reduce(
                      (sum, officer) => sum + officer.total_cases,
                      0
                    );
                    const closedCases = officersOfGrade.reduce(
                      (sum, officer) => sum + officer.closed_cases,
                      0
                    );
                    const openCases = officersOfGrade.reduce(
                      (sum, officer) => sum + officer.open_cases,
                      0
                    );
                    const investigating = officersOfGrade.reduce(
                      (sum, officer) => sum + officer.investigating_cases,
                      0
                    );

                    return {
                      grade: grade.grade,
                      officers: grade.count,
                      total_cases: totalCases,
                      closed_cases: closedCases,
                      open_cases: openCases,
                      investigating_cases: investigating,
                      success_rate:
                        totalCases > 0
                          ? ((closedCases / totalCases) * 100).toFixed(1)
                          : 0,
                    };
                  })}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="closed_cases"
                    stackId="a"
                    fill="#00C49F"
                    name="Closed Cases"
                  />
                  <Bar
                    dataKey="open_cases"
                    stackId="a"
                    fill="#FF8042"
                    name="Open Cases"
                  />
                  <Bar
                    dataKey="investigating_cases"
                    stackId="a"
                    fill="#FFBB28"
                    name="Under Investigation"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Simple message for unimplemented tabs */}
        {activeTab !== "dashboard" &&
          activeTab !== "crime" &&
          activeTab !== "thana" &&
          activeTab !== "officers" && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold mb-4">
                {activeTab === "crime" && "Crime Analytics"}
                {activeTab === "thana" && "Thana Analysis"}
                {activeTab === "officers" && "Officer Performance"}
              </h3>
              <p className="text-gray-600">
                This section shows detailed analytics for {activeTab} data.
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
