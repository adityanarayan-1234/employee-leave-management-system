import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { useToast } from "../context/ToastContext";

export default function EmployeeProfile() {
  const { id } = useParams();
  const { showToast } = useToast();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/employees/${id}`)
      .then((res) => setEmployee(res.data.employee))
      .catch((err) => showToast(err.response?.data?.message || "Failed to load profile", "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner label="Loading profile..." />
      </DashboardLayout>
    );
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <p className="text-slate-400">Employee not found.</p>
      </DashboardLayout>
    );
  }

  const initial = employee.name?.charAt(0)?.toUpperCase() || "?";

  const details = [
    { label: "Email", value: employee.email },
    { label: "Department", value: employee.department },
    { label: "Role", value: employee.role, capitalize: true },
    { label: "Leave Balance", value: `${employee.leaveBalance} day(s)` },
    { label: "Joined", value: new Date(employee.createdAt).toLocaleDateString() },
  ];

  return (
    <DashboardLayout>
      <Link
        to="/admin/employees"
        className="text-sm text-slate-500 hover:text-amber-600 mb-4 inline-block"
      >
        ← Back to Employee Directory
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-900 font-bold text-2xl flex items-center justify-center">
            {initial}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{employee.name}</h1>
            <p className="text-slate-500 text-sm">{employee.email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {details.map((detail) => (
            <div key={detail.label}>
              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                {detail.label}
              </p>
              <p className={`text-slate-800 font-medium ${detail.capitalize ? "capitalize" : ""}`}>
                {detail.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
