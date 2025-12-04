import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getPayments } from "../api/payments";

function formatMoneyFromMinor(minor, currency = "INR") {
  if (minor == null) return "-";
  const major = minor / 100;
  return major.toLocaleString("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
}

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getPayments();
        setPayments(res.data.data || []);
      } catch (err) {
        setError("Failed to load payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#F3F4F8]">
      <div className="flex h-full">
        <Sidebar />

        <main className="flex-1 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-40 py-5">
          <div className="max-w-6xl mx-auto flex flex-col w-full">
            <div className="flex flex-wrap justify-between items-center gap-4 p-4 bg-white rounded-card shadow-card border border-gray-200">
              <h1 className="text-slate-900 text-4xl font-black tracking-tight">
                Payments
              </h1>

              <div className="flex items-center gap-3 text-sm">
                {loading && <span className="text-slate-500">Loading...</span>}
                {error && <span className="text-red-500">{error}</span>}
                <button className="flex min-w-[120px] items-center justify-center rounded-full h-11 px-6 text-white text-sm font-semibold tracking-wide gradient-button shadow-lg shadow-indigo-500/30 cursor-not-allowed">
                  Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 px-4 py-5">
              <div className="lg:col-span-2">
                <label className="flex flex-col min-w-40 h-12 w-full">
                  <div className="flex items-center w-full bg-white shadow-sm rounded-full h-full px-4">
                    <span className="material-symbols-outlined text-gray-400">
                      search
                    </span>
                    <input
                      className="form-input flex-1 bg-transparent border-none focus:ring-0 text-gray-900 placeholder:text-gray-400 px-2 text-sm"
                      placeholder="Search payments..."
                      disabled
                    />
                  </div>
                </label>
              </div>

              <div className="flex gap-3 items-center lg:col-span-3">
                <button className="flex h-12 items-center justify-center gap-x-2 rounded-full bg-white shadow-sm px-4 cursor-not-allowed border border-gray-200 text-sm">
                  <p className="text-gray-900 text-sm font-medium">
                    Last 30 Days
                  </p>
                  <span className="material-symbols-outlined text-gray-500">
                    expand_more
                  </span>
                </button>

                <button className="flex h-12 items-center justify-center gap-x-2 rounded-full bg-white shadow-sm px-4 cursor-not-allowed border border-gray-200 text-sm">
                  <p className="text-gray-900 text-sm font-medium">
                    Status
                  </p>
                  <span className="material-symbols-outlined text-gray-500">
                    expand_more
                  </span>
                </button>

                <button className="flex h-12 items-center justify-center gap-x-2 rounded-full bg-white shadow-sm px-4 cursor-not-allowed border border-gray-200 text-sm">
                  <p className="text-gray-900 text-sm font-medium">
                    Gateway
                  </p>
                  <span className="material-symbols-outlined text-gray-500">
                    expand_more
                  </span>
                </button>
              </div>
            </div>

            <div className="px-4 py-3">
              <div className="overflow-hidden rounded-card border border-gray-200 bg-white shadow-card">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Payment ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Gateway
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {!loading && payments.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-8 text-center text-sm text-slate-500"
                        >
                          No payments found.
                        </td>
                      </tr>
                    )}

                    {payments.map((p) => {
                      const currency =
                        p.invoice?.currency || p.currency || "INR";
                      const amountMinor =
                        p.amountMinor ?? p.invoice?.amountPaidMinor ?? 0;
                      const createdAt = p.createdAt
                        ? new Date(p.createdAt).toLocaleString()
                        : "—";

                      const status = (p.status || "").toLowerCase();
                      let statusStyle = "bg-gray-100 text-gray-800";
                      if (status === "succeeded" || status === "paid") {
                        statusStyle = "bg-green-100 text-green-700";
                      } else if (status === "pending") {
                        statusStyle = "bg-yellow-100 text-yellow-700";
                      } else if (status === "failed") {
                        statusStyle = "bg-red-100 text-red-700";
                      }

                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {p.gatewayPaymentId || `pay_${p.id}`}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">
                            {formatMoneyFromMinor(amountMinor, currency)}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {p.gateway}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-x-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusStyle}`}
                            >
                              <span className="size-1.5 rounded-full bg-current" />
                              {p.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {createdAt}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-center p-4 text-sm text-slate-500">
              Pagination will appear here when server-side paging is added.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
