import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export default function ApplyLeave() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { employee } = useAuth();

  const [form, setForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });
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

    if (new Date(form.toDate) < new Date(form.fromDate)) {
      setError("To date cannot be before from date");
      return;
    }

    setSubmitting(true);

    try {
      await API.post("/leaves/apply", form);
      showToast("Leave request submitted successfully", "success");
      navigate("/leave-history");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to apply for leave");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Apply for Leave</h1>
      <p className="text-slate-500 mb-6">
        Fill out the form below to submit a new leave request. You have{" "}
        <span className="font-semibold text-slate-700">
          {employee?.leaveBalance} day(s)
        </span>{" "}
        remaining in your annual balance.
      </p>

      {error && (
        <p className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4 max-w-xl border border-red-100">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-xl bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
      >
        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Leave Type
          </label>
          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
            required
            className="border border-slate-300 p-3 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          >
            <option value="" disabled>
              Select Leave Type
            </option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Earned Leave">Earned Leave</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              From
            </label>
            <input
              type="date"
              name="fromDate"
              value={form.fromDate}
              onChange={handleChange}
              required
              className="border border-slate-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-1 block">
              To
            </label>
            <input
              type="date"
              name="toDate"
              value={form.toDate}
              onChange={handleChange}
              required
              className="border border-slate-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 mb-1 block">
            Reason
          </label>
          <textarea
            name="reason"
            placeholder="Briefly describe your reason for leave"
            value={form.reason}
            onChange={handleChange}
            required
            rows={4}
            className="border border-slate-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-6 py-3 rounded-lg shadow-lg shadow-amber-500/20 transition disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </DashboardLayout>
  );
}
