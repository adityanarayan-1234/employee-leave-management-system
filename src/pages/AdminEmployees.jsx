import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import ConfirmModal from "../components/ConfirmModal";
import AddEmployeeModal from "../components/AddEmployeeModal";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export default function AdminEmployees() {
  const { showToast } = useToast();
  const { employee: currentAdmin } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDept, setNewDept] = useState("");

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [removeId, setRemoveId] = useState(null);

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

  const loadEmployees = () => {
    setLoading(true);

    API.get("/employees", { params: { search, department, page, limit: 8 } })
      .then((res) => {
        setEmployees(res.data.employees);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => showToast(err.response?.data?.message || "Failed to load employees", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, department, page]);

  const handleRemove = async () => {
    try {
      await API.delete(`/employees/${removeId}`);
      showToast("Employee removed", "success");
      loadEmployees();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to remove employee", "error");
    } finally {
      setRemoveId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-1 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Employee Directory</h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold px-4 py-2 rounded-lg shadow-lg shadow-amber-500/20 transition text-sm"
        >
          + Add Employee
        </button>
      </div>
      <p className="text-slate-500 mb-6">
        Search, browse, and manage everyone registered in the system.
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
            className="border border-slate-300 text-slate-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-50 transition"
          >
            Add Department
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
                  <th className="p-4 text-left">Action</th>
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
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <Link
                          to={`/admin/employees/${emp._id}`}
                          className="text-amber-600 text-sm font-semibold hover:text-amber-700"
                        >
                          View Profile
                        </Link>

                        {emp._id === currentAdmin?._id ? (
                          <span className="text-xs text-slate-400 italic">You</span>
                        ) : (
                          <button
                            onClick={() => setRemoveId(emp._id)}
                            className="text-red-600 text-sm font-semibold hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <AddEmployeeModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onCreated={loadEmployees}
      />

      <ConfirmModal
        open={removeId !== null}
        title="Remove employee?"
        message="This will permanently delete their account and leave records. This cannot be undone."
        confirmLabel="Remove"
        onConfirm={handleRemove}
        onCancel={() => setRemoveId(null)}
      />
    </DashboardLayout>
  );
}
