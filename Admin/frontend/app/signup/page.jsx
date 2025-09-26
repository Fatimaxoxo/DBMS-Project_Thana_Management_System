"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // <- import

export default function SignupPage() {
  const router = useRouter(); // <- router init
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:4000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message);
      router.push("/login"); // <- signup successful hole login page e redirect
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--police-blue)]">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-[var(--police-blue)]">
          User Signup
        </h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="11 Digit Phone"
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6)"
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-[var(--police-blue)] text-white py-2 rounded-lg hover:bg-[var(--police-gold)] hover:text-[var(--police-blue)]"
          >
            Signup
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--police-gold)] font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
