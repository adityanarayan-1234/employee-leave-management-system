import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import API from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmModal from "../components/ConfirmModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { exportLeavesToCsv } from "../utils/exportCsv";

const statusStyles = {
  Approved: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-red-50 text-red-700",
  Pending: "bg-amber-50 text-amber-700",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || "bg-slate-100 text-slate-700"}`}
    >
      {status}
    </span>
  );
}


function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

const statCards = [
  { key: "totalEmployees", label: "Employees", accent: "text-slate-900", bg: "bg-slate-100" },
  { key: "totalLeaves", label: "Total Requests", accent: "text-slate-900", bg: "bg-slate-100" },
  { key: "approved", label: "Approved", accent: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "pending", label: "Pending", accent: "text-amber-600", bg: "bg-amber-50" },
];

export default function AdminDashboard() {
  const { employee } = useAuth();
  const { showToast } = useToast();

  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [confirmId, setConfirmId] = useState(null);

  const fetchAll = async () => {
    try {
      const [leavesRes, statsRes, activityRes] = await Promise.all([
        API.get("/leaves/history"),
        API.get("/leaves/stats"),
        API.get("/activity"),
      ]);
      setLeaves(leavesRes.data);
      setStats(statsRes.data);
      setActivity(activityRes.data);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/leaves/approve/${id}`, { status });
      showToast(`Leave request ${status.toLowerCase()}`, "success");
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || "Action failed", "error");
    }
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/leaves/${confirmId}`);
      showToast("Leave request deleted", "success");
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    } finally {
      setConfirmId(null);
    }
  };

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const matchesSearch = leave.employee?.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || leave.status === statusFilter;
      return (search === "" || matchesSearch) && matchesStatus;
    });
  }, [leaves, search, statusFilter]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner label="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Admin Dashboard</h1>
      <p className="text-slate-500 mb-6">
        A snapshot of leave activity across the organization.
      </p>

      {/* Analytics cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
          >
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${card.bg} ${card.accent}`}>
              {card.label}
            </div>
            <p className={`text-4xl font-extrabold ${card.accent}`}>
              {stats?.[card.key] ?? 0}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly trend chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-sm font-semibold text-slate-600 mb-4">
            Leave Requests - Last 6 Months
          </h2>

          {stats?.monthlyTrend?.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-slate-400 text-sm py-16 text-center">
              Not enough data yet to show a trend.
            </p>
          )}
        </div>

        {/* Recent activity feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-sm font-semibold text-slate-600 mb-4">Recent Activity</h2>

          <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
            {activity.length === 0 && (
              <p className="text-slate-400 text-sm">No activity recorded yet.</p>
            )}

            {activity.map((item) => (
              <div key={item._id} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-slate-700">{item.message}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leave management table */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <h2 className="text-lg font-bold text-slate-900">Manage Leave Requests</h2>

        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by employee name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button
            onClick={() => exportLeavesToCsv(filteredLeaves)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            Export CSV
          </button>

          <Link
            to="/admin/employees"
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800 transition"
          >
            View Employees
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <th className="p-4 text-left">Employee</th>
              <th className="p-4 text-left">Leave Type</th>
              <th className="p-4 text-left">From</th>
              <th className="p-4 text-left">To</th>
              <th className="p-4 text-left">Days</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeaves.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  No leave requests match your filters.
                </td>
              </tr>
            )}

            {filteredLeaves.map((leave) => (
              <tr key={leave._id} className="border-t border-slate-100">
                <td className="p-4 text-slate-800 font-medium">{leave.employee?.name}</td>
                <td className="p-4 text-slate-600">{leave.leaveType}</td>
                <td className="p-4 text-slate-600">{leave.fromDate?.substring(0, 10)}</td>
                <td className="p-4 text-slate-600">{leave.toDate?.substring(0, 10)}</td>
                <td className="p-4 text-slate-600">{leave.days}</td>
                <td className="p-4">
                  <StatusBadge status={leave.status} />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {leave.employee?._id === employee?._id ? (
                      <span className="text-xs text-slate-400 italic">
                        Your request — another admin must review it
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => updateStatus(leave._id, "Approved")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-1.5 rounded-lg transition"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => updateStatus(leave._id, "Rejected")}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-lg transition"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => setConfirmId(leave._id)}
                      title="Delete leave request"
                      className="bg-slate-700 hover:bg-slate-900 text-white p-2 rounded-lg transition"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={confirmId !== null}
        title="Delete leave request?"
        message="This will permanently remove the request. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />
    </DashboardLayout>
  );
}
