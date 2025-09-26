"use client";

import { useState, useEffect } from "react";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function CrimeDetectionPage() {
  const [crimes, setCrimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCrime, setEditingCrime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    crime_type: "",
    suspects: "",
    name: "",
    description: "",
    last_seen_location: "",
    photo: "",
    date: "",
    thana_id: "",
  });

  // Fetch crimes from API
  useEffect(() => {
    fetchCrimes();
  }, []);

  const fetchCrimes = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/crimes");
      if (!response.ok) throw new Error("Failed to fetch crimes");
      const data = await response.json();
      setCrimes(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this crime record?")) return;

    try {
      const response = await fetch(`http://localhost:4000/crimes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete crime");

      setCrimes(crimes.filter((crime) => crime.crime_id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (crime) => {
    setEditingCrime(crime);
    setFormData({
      crime_type: crime.crime_type || "",
      suspects: crime.suspects || "",
      name: crime.name || "",
      description: crime.description || "",
      last_seen_location: crime.last_seen_location || "",
      photo: crime.photo || "",
      date: crime.date ? crime.date.split("T")[0] : "",
      thana_id: crime.thana_id || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingCrime
        ? `http://localhost:4000/crimes/${editingCrime.crime_id}`
        : "http://localhost:4000/crimes";

      const method = editingCrime ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok)
        throw new Error(
          `Failed to ${editingCrime ? "update" : "create"} crime`
        );

      const updatedCrime = await response.json();

      if (editingCrime) {
        setCrimes(
          crimes.map((crime) =>
            crime.crime_id === editingCrime.crime_id ? updatedCrime : crime
          )
        );
      } else {
        setCrimes([...crimes, updatedCrime]);
      }

      setShowModal(false);
      setEditingCrime(null);
      setFormData({
        crime_type: "",
        suspects: "",
        name: "",
        description: "",
        last_seen_location: "",
        photo: "",
        date: "",
        thana_id: "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredCrimes = crimes.filter(
    (crime) =>
      crime.crime_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crime.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crime.suspects?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crime.last_seen_location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Crime Detection Management
      </h1>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search crimes..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Crime
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Suspects
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thana ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCrimes.map((crime) => (
              <tr key={crime.crime_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {crime.crime_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {crime.crime_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {crime.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {crime.suspects}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {crime.last_seen_location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(crime.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {crime.thana_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(crime)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    <PencilIcon className="h-5 w-5 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(crime.crime_id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCrimes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No crime records found
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold">
                {editingCrime ? "Edit Crime" : "Add New Crime"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="crime_type"
                >
                  Crime Type
                </label>
                <input
                  type="text"
                  id="crime_type"
                  name="crime_type"
                  value={formData.crime_type}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="suspects"
                >
                  Suspects
                </label>
                <input
                  type="text"
                  id="suspects"
                  name="suspects"
                  value={formData.suspects}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Case Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="last_seen_location"
                >
                  Last Seen Location
                </label>
                <input
                  type="text"
                  id="last_seen_location"
                  name="last_seen_location"
                  value={formData.last_seen_location}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="photo"
                >
                  Photo URL
                </label>
                <input
                  type="text"
                  id="photo"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="date"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="thana_id"
                >
                  Thana ID
                </label>
                <input
                  type="number"
                  id="thana_id"
                  name="thana_id"
                  value={formData.thana_id}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingCrime(null);
                    setFormData({
                      crime_type: "",
                      suspects: "",
                      name: "",
                      description: "",
                      last_seen_location: "",
                      photo: "",
                      date: "",
                      thana_id: "",
                    });
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                >
                  {editingCrime ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
