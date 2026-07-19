import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const ANNUAL_QUOTA = 18;

export default function Dashboard() {
  const { employee } = useAuth();
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/leaves/my")
      .then((res) => {
        const leaves = res.data;
        setStats({
          total: leaves.length,
          approved: leaves.filter((l) => l.status === "Approved").length,
          pending: leaves.filter((l) => l.status === "Pending").length,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Leaves", value: stats.total, accent: "text-slate-900", bg: "bg-slate-100" },
    { label: "Approved", value: stats.approved, accent: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Pending", value: stats.pending, accent: "text-amber-600", bg: "bg-amber-50" },
  ];

  const balance = employee?.leaveBalance ?? 0;
  const usedPercent = Math.min(
    Math.round(((ANNUAL_QUOTA - balance) / ANNUAL_QUOTA) * 100),
    100
  );

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">
        Welcome back, {employee?.name?.split(" ")[0]}
      </h1>
      <p className="text-slate-500 mb-8">
        Here's a snapshot of your leave activity.
      </p>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Leave balance card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-600">
                Annual Leave Balance
              </h2>
              <span className="text-sm font-bold text-slate-900">
                {balance} / {ANNUAL_QUOTA} days left
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div
                className="bg-amber-500 h-2.5 rounded-full transition-all"
                style={{ width: `${usedPercent}%` }}
              />
            </div>

            <p className="text-xs text-slate-400 mt-2">
              {usedPercent}% of your annual quota used
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
              >
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${card.bg} ${card.accent}`}>
                  {card.label}
                </div>
                <p className={`text-4xl font-extrabold ${card.accent}`}>
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
