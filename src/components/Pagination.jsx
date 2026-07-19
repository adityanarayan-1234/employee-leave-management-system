export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
      <p className="text-xs text-slate-500">
        Page {page} of {totalPages}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
        >
          Previous
        </button>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
