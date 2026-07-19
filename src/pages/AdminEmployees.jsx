import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import { useToast } from "../context/ToastContext";

export default function AdminEmployees() {
  const { showToast } = useToast();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDept, setNewDept] = useState("");

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadDepartments = () => {
    API.get("/departments")
      .then((res) => setDepartments(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDept.trim()) return;

    try {
      await API.post("/departments", { name: newDept.trim() });
      showToast("Department added", "success");
      setNewDept("");
      loadDepartments();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add department", "error");
    }
  };

  useEffect(() => {
    setLoading(true);

    API.get("/employees", { params: { search, department, page, limit: 8 } })
      .then((res) => {
        setEmployees(res.data.employees);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => showToast(err.response?.data?.message || "Failed to load employees", "error"))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, department, page]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Employee Directory</h1>
      <p className="text-slate-500 mb-6">
        Search and browse everyone registered in the system.
      </p>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border border-slate-300 rounded-lg px-4 py-2 text-sm flex-1 min-w-[220px] focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <select
          value={department}
          onChange={(e) => {
            setPage(1);
            setDepartment(e.target.value);
          }}
          className="border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept._id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>

        <form onSubmit={handleAddDepartment} className="flex gap-2 ml-auto">
          <input
            type="text"
            placeholder="New department name"
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)}
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            className="bg-slate-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-800 transition"
          >
            Add
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Department</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Leave Balance</th>
                  <th className="p-4 text-left"></th>
                </tr>
              </thead>

              <tbody>
                {employees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      No employees match your search.
                    </td>
                  </tr>
                )}

                {employees.map((emp) => (
                  <tr key={emp._id} className="border-t border-slate-100">
                    <td className="p-4 text-slate-800 font-medium">{emp.name}</td>
                    <td className="p-4 text-slate-600">{emp.email}</td>
                    <td className="p-4 text-slate-600">{emp.department}</td>
                    <td className="p-4 text-slate-600 capitalize">{emp.role}</td>
                    <td className="p-4 text-slate-600">{emp.leaveBalance} days</td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/admin/employees/${emp._id}`}
                        className="text-amber-600 text-sm font-semibold hover:text-amber-700"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
