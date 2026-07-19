import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { employee, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initial = employee?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
      <h2 className="font-semibold text-slate-800 text-lg">
        {employee?.role === "admin" ? "Admin Overview" : "My Workspace"}
      </h2>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-900 font-bold flex items-center justify-center">
            {initial}
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-800">
              {employee?.name}
            </p>
            <p className="text-xs text-slate-400 capitalize">
              {employee?.role}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
