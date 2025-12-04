import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getInvoices } from "../api/invoices";

function formatMoneyFromMinor(minor, currency = "INR") {
  if (minor == null) return "-";
  const major = minor / 100;
  return major.toLocaleString("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
}

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await getInvoices();
        setInvoices(res.data.data || []);
      } catch (err) {
        setError("Failed to load invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#F3F4F8]">
      <div className="flex flex-grow">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <header className="flex justify-between items-center flex-wrap gap-4">
              <h1 className="text-slate-900 text-4xl font-black tracking-tight">
                Invoices
              </h1>
              {loading && (
                <span className="text-sm text-slate-500">Loading...</span>
              )}
              {error && (
                <span className="text-sm text-red-500">{error}</span>
              )}
            </header>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full md:w-96">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-gray-900 focus:ring-primary focus:border-primary text-sm"
                  disabled
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto justify-end">
                <button className="flex items-center justify-center h-11 w-11 border border-gray-200 bg-white rounded-full cursor-not-allowed">
                  <span className="material-symbols-outlined text-slate-600">
                    filter_list
                  </span>
                </button>

                <button className="flex items-center gap-2 px-5 h-11 bg-primary text-white rounded-full shadow cursor-not-allowed text-sm font-medium">
                  <span className="material-symbols-outlined text-base">
                    add
                  </span>
                  Create Invoice
                </button>
              </div>
            </div>

            <div className="w-full">
              <div className="overflow-hidden rounded-card border border-gray-200 bg-white shadow-card">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                          Invoice #
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                          Subscription
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                          Date Issued
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                          Date Due
                        </th>
                        <th className="px-6 py-4 text-right"></th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {!loading && invoices.length === 0 && (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-6 py-8 text-center text-sm text-slate-500"
                          >
                            No invoices found.
                          </td>
                        </tr>
                      )}

                      {invoices.map((inv) => {
                        const subscriptionName =
                          inv.subscription?.plan?.name || "—";
                        const currency = inv.currency || "INR";
                        const issued = inv.periodStart
                          ? new Date(inv.periodStart).toLocaleDateString()
                          : "—";
                        const due = inv.periodEnd
                          ? new Date(inv.periodEnd).toLocaleDateString()
                          : "—";
                        const amount =
                          inv.amountDueMinor ?? inv.amountPaidMinor ?? 0;

                        const status = (inv.status || "").toLowerCase();
                        let statusStyle =
                          "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
                        if (status === "paid" || status === "succeeded") {
                          statusStyle =
                            "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-400";
                        } else if (status === "due" || status === "open") {
                          statusStyle =
                            "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-400";
                        } else if (status === "failed" || status === "void") {
                          statusStyle =
                            "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400";
                        }

                        return (
                          <tr
                            key={inv.id}
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => navigate(`/invoices/${inv.id}`)}
                          >
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                              {inv.invoiceNumber}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700">
                              {formatMoneyFromMinor(amount, currency)}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}
                              >
                                {inv.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700">
                              {subscriptionName}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700">
                              {issued}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                              {due}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-slate-400 hover:text-primary">
                                <span className="material-symbols-outlined">
                                  chevron_right
                                </span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <nav className="flex items-center justify-center p-4 gap-2 text-sm text-slate-500">
              Pagination will appear here when server-side paging is added.
            </nav>
          </div>
        </main>
      </div>
    </div>
  );
}
