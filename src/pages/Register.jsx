import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await API.post("/employees/register", form);
      showToast("Registration successful. Please log in.", "success");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Brand panel */}
      <div className="hidden md:flex w-1/2 flex-col justify-between p-12 text-white bg-gradient-to-br from-slate-900 to-slate-950">
        <Link to="/" className="text-lg font-extrabold tracking-tight leading-snug">
          Employee Leave<br />Management System
        </Link>

        <div>
          <h2 className="text-3xl font-bold mb-3">Join your team.</h2>
          <p className="text-slate-300 max-w-sm">
            Create an account to start applying for leave and tracking your
            requests in one place.
          </p>
        </div>

        <p className="text-slate-500 text-xs">
          &copy; {new Date().getFullYear()} Employee Leave Management System. All rights reserved.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Fill in your details to get started.
          </p>

          {error && (
            <p className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4 border border-red-100">
              {error}
            </p>
          )}

          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Full Name
          </label>
          <input
            name="name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-slate-300 w-full p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />

          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@company.com"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-slate-300 w-full p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />

          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Password
          </label>
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="border border-slate-300 w-full p-3 pr-16 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-semibold hover:text-amber-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Department <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            name="department"
            placeholder="e.g. Engineering"
            value={form.department}
            onChange={handleChange}
            className="border border-slate-300 w-full p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />

          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Role
          </label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border border-slate-300 w-full p-3 mb-6 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold w-full p-3 rounded-lg shadow-lg shadow-amber-500/20 transition disabled:opacity-60"
          >
            {submitting ? "Registering..." : "Register"}
          </button>

          <p className="text-center text-sm mt-6 text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-600 font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
