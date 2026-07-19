import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-slate-900 to-slate-950">
      <span className="uppercase tracking-[0.3em] text-amber-400 text-xs font-semibold mb-4">
        Welcome to
      </span>

      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
        Employee Leave Management System
      </h1>

      <p className="text-slate-300 max-w-xl mb-10 text-lg">
        Apply for leave, track approvals, and manage your team's time off
        from one clean, professional dashboard.
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-amber-500 text-slate-900 font-semibold px-8 py-3 rounded-lg shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="border border-slate-500 text-slate-200 font-semibold px-8 py-3 rounded-lg hover:border-amber-400 hover:text-amber-400 transition"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
