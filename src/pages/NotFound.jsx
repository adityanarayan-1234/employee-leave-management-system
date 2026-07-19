import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-6">
      <p className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-2">
        404 Error
      </p>
      <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
        Page not found
      </h1>
      <p className="text-slate-500 mb-8 max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="bg-slate-900 text-white font-semibold px-6 py-3 rounded-lg hover:bg-slate-800 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
