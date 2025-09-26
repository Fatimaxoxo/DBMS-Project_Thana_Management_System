"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const fetchComplaints = async () => {
    let url = "http://localhost:4000/api/complaints";
    if (search) url += `?complaint_id=${search}`;
    const res = await fetch(url);
    const data = await res.json();
    setComplaints(data);
  };

  useEffect(() => {
    fetchComplaints();
  }, [search]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this complaint?")) return;
    const res = await fetch(`http://localhost:4000/api/complaints/${id}`, {
      method: "DELETE",
    });
    if (res.status === 204) {
      setComplaints(complaints.filter((c) => c.complaint_id !== id));
      alert("Complaint deleted successfully!");
    } else {
      alert("Failed to delete complaint.");
    }
  };

  const sortedComplaints = [...complaints].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortAsc ? dateA - dateB : dateB - dateA;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Complaints</h1>
        <Link
          href="/complaints/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Complaint
        </Link>
      </div>

      <div className="mb-4 flex space-x-2">
        <input
          type="number"
          placeholder="Search by Complaint ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="bg-gray-200 px-3 rounded"
        >
          Sort by Date {sortAsc ? "↑" : "↓"}
        </button>
      </div>

      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Complaint ID</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Victim</th>
            <th className="border px-4 py-2">Thana</th>
            <th className="border px-4 py-2">Crime</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedComplaints.map((c) => (
            <tr key={c.complaint_id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{c.complaint_id}</td>
              <td className="border px-4 py-2">{c.description}</td>
              <td className="border px-4 py-2">{c.date}</td>
              <td className="border px-4 py-2">{c.victim_name}</td>
              <td className="border px-4 py-2">{c.thana_id}</td>
              <td className="border px-4 py-2">{c.crime_name}</td>
              <td className="border px-4 py-2">{c.status}</td>
              <td className="border px-4 py-2 space-x-2">
                <Link
                  href={`/complaints/${c.complaint_id}`}
                  className="text-blue-600 hover:underline"
                >
                  Details
                </Link>
                <Link
                  href={`/complaints/edit/${c.complaint_id}`}
                  className="text-green-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(c.complaint_id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
