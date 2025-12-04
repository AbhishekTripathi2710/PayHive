
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";

function formatMoneyFromMinor(minor, currency = "INR") {
  if (minor == null) return "-";
  const major = minor / 100;
  return major.toLocaleString("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await API.get("/dashboard/summary");
        setSummary(res.data.data);
      } catch (err) {
        setError("Failed to load dashboard summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const stats = summary
    ? [
        {
          label: "Active Subscriptions",
          value: summary.activeSubscriptions,
        },
        {
          label: "Total Revenue",
          value: formatMoneyFromMinor(summary.totalRevenueMinor),
        },
        {
          label: "Wallet Balance",
          value: formatMoneyFromMinor(summary.walletBalanceMinor),
        },
        {
          label: "Past Due Subscriptions",
          value: summary.pastDueSubscriptions,
        },
      ]
    : [];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#F3F4F8]">
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between gap-3">
              <div>
                <p className="text-slate-900 text-4xl font-black tracking-tight">
                  Dashboard
                </p>
                <p className="text-slate-500">
                  Billing Overview
                </p>
              </div>

              {loading && (
                <span className="text-sm text-slate-500">Loading...</span>
              )}
              {error && (
                <span className="text-sm text-red-500">{error}</span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-2 rounded-card p-6 bg-white border border-slate-200 shadow-card hover:shadow-lg hover:-translate-y-0.5 transition"
                >
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                    {item.label}
                  </p>
                  <p className="text-slate-900 text-3xl font-semibold">
                    {item.value ?? "-"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <div className="flex flex-col gap-4 rounded-card p-6 bg-white border border-slate-200 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                      Revenue Overview
                    </p>
                    <p className="text-4xl font-bold text-slate-900 mt-1">
                      {summary
                        ? formatMoneyFromMinor(summary.totalRevenueMinor)
                        : "—"}
                    </p>

                    <div className="flex gap-2 items-center mt-2 text-xs text-slate-500">
                      <span>Last 30 days</span>
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <span className="material-symbols-outlined text-base">
                          trending_up
                        </span>
                        <span>+12.5%</span>
                      </span>
                    </div>
                  </div>

                  {/* Chart duration buttons */}
                  <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1 self-start">
                    {["30D", "90D", "1Y", "All"].map((label) => (
                      <button
                        key={label}
                        className={`px-3 py-1 text-xs rounded-full ${
                          label === "90D"
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:bg-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col py-4 gap-8 min-h-[260px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="-3 0 478 150"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 109C18 109 18 21 36 21C54 21 54 41 72 41C90 41 90 93 108 93C127 93 127 33 145 33C163 33 163 101 181 101C199 101 199 61 217 61C236 61 236 45 254 45C272 45 272 121 290 121C308 121 308 149 326 149C344 149 344 1 363 1C381 1 381 81 399 81C417 81 417 129 435 129C453 129 453 25 472 25V149H0V109Z"
                      fill="url(#paint0)"
                    />
                    <path
                      d="M0 109C18 109 18 21 36 21C54 21 54 41 72 41C90 41 90 93 108 93C127 93 127 33 145 33C163 33 163 101 181 101C199 101 199 61 217 61C236 61 236 45 254 45C272 45 272 121 290 121C308 121 308 149 326 149C344 149 344 1 363 1C381 1 381 81 399 81C417 81 417 129 435 129C453 129 453 25 472 25"
                      stroke="#2563EB"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="paint0" x1="236" y1="1" x2="236" y2="149">
                        <stop stopColor="#2563EB" stopOpacity="0.18" />
                        <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="flex justify-around text-xs font-semibold text-slate-400">
                    <p>WEEK 1</p>
                    <p>WEEK 2</p>
                    <p>WEEK 3</p>
                    <p>WEEK 4</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
