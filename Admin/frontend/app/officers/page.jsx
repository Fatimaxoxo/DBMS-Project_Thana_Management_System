"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function OfficersPage() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [formData, setFormData] = useState({
    officer_id: "",
    name: "",
    grade: "",
    email: "",
    phone: "",
    thana_id: "",
    division_office: "",
  });
  const [showModal, setShowModal] = useState(false);

  const API_URL = "http://localhost:4000/api/officers";

  // fetch all officers
  const fetchOfficers = async () => {
    try {
      const res = await axios.get(API_URL);
      setOfficers(res.data);
    } catch (err) {
      console.error("Error fetching officers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  // handle form input
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // open modal for add/edit
  const handleOpenModal = (officer = null) => {
    if (officer) {
      setEditingOfficer(officer);
      setFormData(officer);
    } else {
      setEditingOfficer(null);
      setFormData({
        officer_id: "",
        name: "",
        grade: "",
        email: "",
        phone: "",
        thana_id: "",
        division_office: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // create or update officer
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOfficer) {
        await axios.put(`${API_URL}/${editingOfficer.officer_id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchOfficers();
      setShowModal(false);
    } catch (err) {
      console.error("Error saving officer", err);
    }
  };

  // delete officer
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this officer?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchOfficers();
    } catch (err) {
      console.error("Error deleting officer", err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Officer Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Officer
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : officers.length === 0 ? (
        <p>No officers found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Grade</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Thana</th>
                <th className="p-2 border">Division</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {officers.map((officer) => (
                <tr key={officer.officer_id} className="hover:bg-gray-50">
                  <td className="p-2 border">{officer.officer_id}</td>
                  <td className="p-2 border">{officer.name}</td>
                  <td className="p-2 border">{officer.grade}</td>
                  <td className="p-2 border">{officer.email}</td>
                  <td className="p-2 border">{officer.phone}</td>
                  <td className="p-2 border">{officer.thana_id}</td>
                  <td className="p-2 border">{officer.division_office}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleOpenModal(officer)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(officer.officer_id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingOfficer ? "Edit Officer" : "Add Officer"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Officer ID *
                </label>
                <input
                  type="text"
                  name="officer_id"
                  value={formData.officer_id}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                  readOnly={!!editingOfficer}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Grade *
                </label>
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Thana ID *
                </label>
                <input
                  type="number"
                  name="thana_id"
                  value={formData.thana_id}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Division Office *
                </label>
                <input
                  type="text"
                  name="division_office"
                  value={formData.division_office}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingOfficer ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
