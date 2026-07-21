import { useState } from "react";
import API from "../services/api";
import { useToast } from "../context/ToastContext";

export default function AddEmployeeModal({ open, onClose, onCreated }) {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "employee",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetAndClose = () => {
    setForm({ name: "", email: "", password: "", department: "", role: "employee" });
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await API.post("/employees", form);
      showToast("Employee added successfully", "success");
      resetAndClose();
      onCreated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add employee");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Add Employee</h2>
        <p className="text-slate-500 text-sm mb-5">
          Create a new employee or admin account directly.
        </p>

        {error && (
          <p className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4 border border-red-100">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-slate-300 w-full p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-slate-300 w-full p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Temporary Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="border border-slate-300 w-full p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <input
            name="department"
            placeholder="Department (optional)"
            value={form.department}
            onChange={handleChange}
            className="border border-slate-300 w-full p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border border-slate-300 w-full p-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={resetAndClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-900 transition disabled:opacity-60"
            >
              {submitting ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
