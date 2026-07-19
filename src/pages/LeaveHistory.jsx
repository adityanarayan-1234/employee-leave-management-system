import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";

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

export default function LeaveHistory() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    API.get("/leaves/my")
      .then((res) => setLeaves(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredLeaves = useMemo(() => {
    if (statusFilter === "All") return leaves;
    return leaves.filter((leave) => leave.status === statusFilter);
  }, [leaves, statusFilter]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Leave History</h1>
          <p className="text-slate-500">
            A record of every leave request you've submitted.
          </p>
        </div>

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
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">From</th>
                <th className="p-4 text-left">To</th>
                <th className="p-4 text-left">Days</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeaves.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400">
                    No leave requests match this filter.
                  </td>
                </tr>
              )}

              {filteredLeaves.map((leave) => (
                <tr key={leave._id} className="border-t border-slate-100">
                  <td className="p-4 text-slate-800 font-medium">{leave.leaveType}</td>
                  <td className="p-4 text-slate-600">{leave.fromDate?.substring(0, 10)}</td>
                  <td className="p-4 text-slate-600">{leave.toDate?.substring(0, 10)}</td>
                  <td className="p-4 text-slate-600">{leave.days}</td>
                  <td className="p-4">
                    <StatusBadge status={leave.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
