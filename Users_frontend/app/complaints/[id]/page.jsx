"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ComplaintDetailsPage() {
  const params = useParams();
  const { id } = params;
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/complaints/${id}`);
        if (!res.ok) throw new Error("Complaint not found");
        const data = await res.json();
        setComplaint(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchComplaint();
  }, [id]);

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!complaint) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Complaint Details</h1>
      <p>
        <strong>ID:</strong> {complaint.complaint_id}
      </p>
      <p>
        <strong>Description:</strong> {complaint.description}
      </p>
      <p>
        <strong>Date:</strong> {complaint.date}
      </p>
      <p>
        <strong>Acknowledgment ID:</strong> {complaint.acknowledgment_id}
      </p>
      <p>
        <strong>Status:</strong> {complaint.status}
      </p>
      <p>
        <strong>Victim:</strong> {complaint.victim_name}
      </p>
      <p>
        <strong>Crime:</strong> {complaint.crime_name}
      </p>
      <p>
        <strong>Crime Type:</strong> {complaint.crime_type}
      </p>
      <p>
        <strong>Thana ID:</strong> {complaint.thana_id}
      </p>
    </div>
  );
}
