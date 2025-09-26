"use client";

import { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Change this if your backend port or path is different
const API_BASE = "http://localhost:4000/api";

export default function ThanaPage() {
  const [thanas, setThanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingThana, setEditingThana] = useState(null);
  const [formData, setFormData] = useState({
    thana_id: "",
    name: "",
    address: "",
    contact: "",
  });

  // Fetch all thanas
  useEffect(() => {
    const fetchThanas = async () => {
      try {
        const res = await fetch(`${API_BASE}/thanas`);
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        setThanas(Array.isArray(data) ? data : []);
      } catch (e) {
        toast.error("Failed to fetch thanas");
      } finally {
        setLoading(false);
      }
    };
    fetchThanas();
  }, []);

  // Derived: filtered + sorted list (by thana_id asc)
  const filteredThanas = useMemo(() => {
    const q = (searchTerm || "").toLowerCase();
    const list = thanas.filter((t) => {
      const idMatch =
        t?.thana_id?.toString().toLowerCase().includes(q) ?? false;
      const nameMatch = (t?.name || "").toLowerCase().includes(q);
      return idMatch || nameMatch;
    });
    return list.sort((a, b) => (a.thana_id || 0) - (b.thana_id || 0));
  }, [thanas, searchTerm]);

  // Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // sanitize id: allow only digits
    if (name === "thana_id") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData((s) => ({ ...s, [name]: digitsOnly }));
      return;
    }
    setFormData((s) => ({ ...s, [name]: value }));
  };

  // Open modal (create)
  const openCreate = () => {
    setEditingThana(null);
    setFormData({ thana_id: "", name: "", address: "", contact: "" });
    setIsModalOpen(true);
  };

  // Open modal (edit)
  const handleEdit = (thana) => {
    setEditingThana(thana);
    setFormData({
      thana_id: thana.thana_id?.toString() || "",
      name: thana.name || "",
      address: thana.address || "",
      contact: thana.contact || "",
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingThana(null);
    setFormData({ thana_id: "", name: "", address: "", contact: "" });
  };

  // Create/Update submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!formData.name || !formData.address || !formData.contact) {
      toast.error("Please fill all fields");
      return;
    }
    if (!editingThana) {
      if (!formData.thana_id) {
        toast.error("Thana ID is required");
        return;
      }
    }
    if (!/^\d{11}$/.test(formData.contact)) {
      toast.error("Contact must be an 11-digit number");
      return;
    }

    try {
      if (editingThana) {
        // UPDATE
        const res = await fetch(`${API_BASE}/thanas/${editingThana.thana_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            address: formData.address,
            contact: formData.contact,
          }),
        });
        if (!res.ok) throw new Error("Update failed");
        const updated = await res.json();

        // some APIs return {affectedRows:1}; try to keep UI in sync anyway
        setThanas((prev) =>
          prev.map((t) =>
            t.thana_id === editingThana.thana_id
              ? {
                  ...t,
                  ...updated,
                  thana_id: editingThana.thana_id,
                  name: formData.name,
                  address: formData.address,
                  contact: formData.contact,
                }
              : t
          )
        );
        toast.success("Thana updated successfully");
      } else {
        // CREATE (schema requires explicit thana_id)
        const res = await fetch(`${API_BASE}/thanas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            thana_id: Number(formData.thana_id),
            name: formData.name,
            address: formData.address,
            contact: formData.contact,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || "Create failed");
        }
        const created = await res.json();

        // Accept either full object or just OK status
        const newRow =
          created && created.thana_id
            ? created
            : {
                thana_id: Number(formData.thana_id),
                name: formData.name,
                address: formData.address,
                contact: formData.contact,
              };

        setThanas((prev) => [...prev, newRow]);
        toast.success("Thana created successfully");
      }

      closeModal();
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this thana?")) return;
    try {
      const res = await fetch(`${API_BASE}/thanas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setThanas((prev) => prev.filter((t) => t.thana_id !== id));
      toast.success("Thana deleted successfully");
    } catch (e) {
      toast.error("Failed to delete thana");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--police-blue-weak)] p-6">
      <ToastContainer position="top-right" autoClose={2800} />
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-[var(--police-blue)]">
            Thana Management
          </h1>
          <p className="text-sm text-[var(--police-blue)]/70">
            Add, edit, search and delete thanas
          </p>
        </header>

        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-6">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name or ID…"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--police-gold)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
            onClick={openCreate}
            className="inline-flex items-center justify-center bg-[var(--police-blue)] hover:bg-[var(--police-gold)] hover:text-[var(--police-blue)] text-white px-4 py-2 rounded-lg transition font-semibold"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v12M6 12h12"
              />
            </svg>
            Add Thana
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--police-blue)]" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["ID", "Name", "Address", "Contact", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredThanas.length ? (
                  filteredThanas.map((thana) => (
                    <tr key={thana.thana_id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {thana.thana_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {thana.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {thana.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {thana.contact}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(thana)}
                          className="text-[var(--police-blue)] hover:underline mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(thana.thana_id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-6 text-center text-sm text-gray-500"
                    >
                      No thanas found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center border-b px-6 py-4 bg-[var(--police-blue)] text-white">
              <h3 className="text-lg font-semibold">
                {editingThana ? "Edit Thana" : "Add New Thana"}
              </h3>
              <button
                onClick={closeModal}
                className="opacity-90 hover:opacity-100"
                aria-label="Close"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* thana_id (required on create; read-only on edit) */}
              <div>
                <label
                  htmlFor="thana_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Thana ID
                </label>
                <input
                  id="thana_id"
                  type="text"
                  name="thana_id"
                  inputMode="numeric"
                  pattern="\d*"
                  value={formData.thana_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--police-gold)] disabled:bg-gray-100"
                  placeholder="e.g. 3"
                  required={!editingThana}
                  disabled={!!editingThana}
                />
                {!editingThana && (
                  <p className="text-xs text-gray-500 mt-1">
                    Must be a unique integer.
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--police-gold)]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Address
                </label>
                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--police-gold)]"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Contact (11 digits)
                </label>
                <input
                  id="contact"
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--police-gold)]"
                  required
                  pattern="\d{11}"
                  title="Please enter 11 digit phone number"
                  placeholder="01XXXXXXXXX"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[var(--police-blue)] hover:bg-[var(--police-gold)] hover:text-[var(--police-blue)] text-white font-semibold py-2 px-4 rounded-lg"
                >
                  {editingThana ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
