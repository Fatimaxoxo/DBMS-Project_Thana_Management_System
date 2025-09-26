"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function EditComplaintPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [formData, setFormData] = useState({
    description: "",
    date: "",
    acknowledgment_id: "",
    status: "",
    victim_id: "",
    thana_id: "",
    crime_id: "",
  });

  const [victims, setVictims] = useState([]);
  const [thanas, setThanas] = useState([]);
  const [crimes, setCrimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch complaint details
        const complaintRes = await fetch(
          `http://localhost:4000/api/complaints/${id}`
        );
        if (!complaintRes.ok) throw new Error("Failed to fetch complaint");
        const complaintData = await complaintRes.json();

        // Fetch related data
        const [victimsRes, thanasRes, crimesRes] = await Promise.all([
          fetch("http://localhost:4000/api/victims"),
          fetch("http://localhost:4000/api/thanas"),
          fetch("http://localhost:4000/api/crimes"),
        ]);

        if (!victimsRes.ok || !thanasRes.ok || !crimesRes.ok) {
          throw new Error("Failed to fetch related data");
        }

        setFormData({
          ...complaintData,
          date: complaintData.date?.split("T")[0] || "",
        });
        setVictims(await victimsRes.json());
        setThanas(await thanasRes.json());
        setCrimes(await crimesRes.json());
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format date as YYYY-MM-DD without timezone information
      const formattedDate = formData.date ? `${formData.date}T00:00:00` : null;

      const res = await fetch(`http://localhost:4000/api/complaints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          date: formattedDate,
        }),
      });

      if (res.ok) {
        alert("Complaint updated successfully!");
        router.push("/complaints");
      } else {
        const error = await res.json();
        throw new Error(error.message || "Failed to update complaint");
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button
          onClick={() => router.push("/complaints")}
          className="mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Back to Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Edit Complaint #{id}
        </h1>
        <p className="text-gray-600">Update complaint details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Acknowledgment ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Acknowledgment ID *
            </label>
            <input
              type="number"
              name="acknowledgment_id"
              value={formData.acknowledgment_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Victim */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Victim *
            </label>
            <select
              name="victim_id"
              value={formData.victim_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Victim</option>
              {victims.map((v) => (
                <option key={v.victim_id} value={v.victim_id}>
                  {v.name} (NID: {v.nid})
                </option>
              ))}
            </select>
          </div>

          {/* Thana */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thana *
            </label>
            <select
              name="thana_id"
              value={formData.thana_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Thana</option>
              {thanas.map((t) => (
                <option key={t.thana_id} value={t.thana_id}>
                  {t.name} ({t.address})
                </option>
              ))}
            </select>
          </div>

          {/* Crime */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crime *
            </label>
            <select
              name="crime_id"
              value={formData.crime_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Crime</option>
              {crimes.map((c) => (
                <option key={c.crime_id} value={c.crime_id}>
                  {c.name} ({c.crime_type})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push("/complaints")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Update Complaint
          </button>
        </div>
      </form>
    </div>
  );
}
