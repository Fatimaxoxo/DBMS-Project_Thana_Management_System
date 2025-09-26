"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VictimPage() {
  const [victims, setVictims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVictim, setEditingVictim] = useState(null);
  const [formData, setFormData] = useState({
    victim_id: "",
    name: "",
    nid: "",
    address: "",
    phone: "",
  });

  // Fetch all victims
  useEffect(() => {
    const fetchVictims = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/victims");
        const data = await response.json();
        setVictims(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch victims");
        setLoading(false);
      }
    };

    fetchVictims();
  }, []);

  // Handle search
  const filteredVictims = victims.filter((victim) => {
    const name = victim?.name?.toLowerCase() || "";
    const victimId = victim?.victim_id?.toString() || "";
    const nid = victim?.nid?.toString() || "";

    return (
      name.includes(searchTerm.toLowerCase()) ||
      victimId.includes(searchTerm) ||
      nid.includes(searchTerm)
    );
  });

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.victim_id ||
      !formData.name ||
      !formData.nid ||
      !formData.address ||
      !formData.phone
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.phone.length !== 11 || !/^\d+$/.test(formData.phone)) {
      toast.error("Phone number must be 11 digits");
      return;
    }

    try {
      if (editingVictim) {
        // Update existing victim
        const response = await fetch(
          `http://localhost:4000/api/victims/${editingVictim.victim_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        const updatedVictim = await response.json();
        setVictims(
          victims.map((v) =>
            v.victim_id === updatedVictim.victim_id ? updatedVictim : v
          )
        );
        toast.success("Victim updated successfully");
      } else {
        // Create new victim
        const response = await fetch("http://localhost:4000/api/victims", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const newVictim = await response.json();
        setVictims([...victims, newVictim]);
        toast.success("Victim created successfully");
      }
      setIsModalOpen(false);
      setFormData({ victim_id: "", name: "", nid: "", address: "", phone: "" });
      setEditingVictim(null);
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this victim?")) {
      try {
        await fetch(`http://localhost:4000/api/victims/${id}`, {
          method: "DELETE",
        });
        setVictims(victims.filter((victim) => victim.victim_id !== id));
        toast.success("Victim deleted successfully");
      } catch (error) {
        toast.error("Failed to delete victim");
      }
    }
  };

  // Open modal for editing
  const handleEdit = (victim) => {
    setEditingVictim(victim);
    setFormData({
      victim_id: victim.victim_id,
      name: victim.name,
      nid: victim.nid,
      address: victim.address,
      phone: victim.phone,
    });
    setIsModalOpen(true);
  };

  // Close modal and reset form
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVictim(null);
    setFormData({ victim_id: "", name: "", nid: "", address: "", phone: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Victim Management
        </h1>

        {/* Search and Add Button */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search by name, ID or NID..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Victim
          </button>
        </div>

        {/* Victim Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVictims.length > 0 ? (
                  filteredVictims.map((victim) => (
                    <tr key={victim.victim_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {victim.victim_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {victim.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {victim.nid}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {victim.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {victim.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(victim)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(victim.victim_id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No victims found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dark overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-40"
            onClick={closeModal}
          ></div>

          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md z-10 mx-4">
            <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50 rounded-t-lg">
              <h3 className="text-lg font-medium text-gray-900">
                {editingVictim ? (
                  <>Edit Victim (ID: {editingVictim.victim_id})</>
                ) : (
                  <>Add New Victim</>
                )}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Victim ID */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Victim ID *
                </label>
                <input
                  type="text"
                  name="victim_id"
                  value={formData.victim_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    editingVictim
                      ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                      : ""
                  }`}
                  required
                  readOnly={!!editingVictim}
                />
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* NID */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  NID *
                </label>
                <input
                  type="text"
                  name="nid"
                  value={formData.nid}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Address */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Phone *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  pattern="[0-9]{11}"
                  title="11 digit phone number"
                />
              </div>

              <div className="flex justify-end border-t pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
                >
                  {editingVictim ? "Update" : "Add Victim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
