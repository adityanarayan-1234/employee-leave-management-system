import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkClasses = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
    isActive
      ? "bg-amber-500 text-slate-900"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

export default function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-6 flex flex-col">
      <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
        Employee Leave
      </p>
      <h1 className="text-xl font-extrabold tracking-tight mb-10">
        Management System
      </h1>

      <nav className="flex flex-col gap-2">
        <NavLink to="/dashboard" className={linkClasses}>
          Dashboard
        </NavLink>

        <NavLink to="/apply-leave" className={linkClasses}>
          Apply Leave
        </NavLink>

        <NavLink to="/leave-history" className={linkClasses}>
          Leave History
        </NavLink>

        {isAdmin && (
          <>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-4 mb-1 px-4">
              Admin
            </p>

            <NavLink to="/admin" className={linkClasses}>
              Overview
            </NavLink>

            <NavLink to="/admin/employees" className={linkClasses}>
              Employees
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
}
