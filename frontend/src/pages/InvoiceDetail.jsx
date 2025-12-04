import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getInvoiceDetail } from "../api/invoices";

function formatMoneyFromMinor(minor, currency = "INR") {
  if (minor == null) return "-";
  const major = minor / 100;
  return major.toLocaleString("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
}

export default function InvoiceDetail() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await getInvoiceDetail(invoiceId);
        setInvoice(res.data.data);
      } catch (err) {
        setError("Failed to load invoice.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const currency = invoice?.currency || "INR";
  const total = invoice?.amountDueMinor ?? invoice?.amountPaidMinor ?? 0;

  return (
    <div className="relative flex min-h-screen w-full bg-[#F3F4F8]">
      <Sidebar />

      <main className="flex-1 px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-between items-center mb-8">
            <div>
              <h1 className="text-slate-900 text-4xl font-black tracking-tight">
                Invoice Details
              </h1>
              <p className="text-slate-500">
                {invoice
                  ? `Invoice #${invoice.invoiceNumber}`
                  : "Loading invoice..."}
              </p>

              {error && (
                <p className="mt-2 text-sm text-red-500">
                  {error}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border rounded-full shadow-sm bg-white text-gray-700 opacity-60 cursor-not-allowed text-sm">
                <span className="material-symbols-outlined text-sm">download</span>
                Download PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full shadow opacity-60 cursor-not-allowed text-sm">
                <span className="material-symbols-outlined text-sm">print</span>
                Print
              </button>
            </div>
          </div>

          <div className="rounded-card bg-white shadow-card border border-gray-200 p-6 mb-8">
            <div className="flex justify-between flex-wrap gap-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {invoice?.subscription?.plan?.name || "PayHive Subscription"}
                </h2>
                <p className="text-gray-600">
                  Invoice for account #{invoice?.accountId}
                </p>
              </div>

              <div className="text-right">
                <p className="text-gray-500 text-sm">
                  Invoice Number
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {invoice?.invoiceNumber || "—"}
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  Issued On
                </p>
                <p className="text-lg font-medium text-slate-800">
                  {invoice?.periodStart
                    ? new Date(invoice.periodStart).toLocaleDateString()
                    : "—"}
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  Period End
                </p>
                <p className="text-lg font-medium text-slate-800">
                  {invoice?.periodEnd
                    ? new Date(invoice.periodEnd).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-card bg-white shadow-card border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-bold mb-4 text-slate-900">Bill To</h3>

            <p className="text-gray-900 font-medium text-lg">
              {invoice?.subscription?.user?.name || "Subscription Customer"}
            </p>
            <p className="text-gray-600">
              {invoice?.subscription?.user?.email || "Email not available"}
            </p>
          </div>

          <div className="rounded-card bg-white shadow-card border border-gray-200 p-6 mb-10">
            <h3 className="text-lg font-bold mb-4 text-slate-900">
              Invoice Items
            </h3>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase text-gray-500">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase text-gray-500">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase text-gray-500">
                      Unit Price
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase text-gray-500">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {invoice?.lineItems?.length ? (
                    invoice.lineItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          {item.description}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {formatMoneyFromMinor(item.amountMinor, currency)}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-900 font-medium">
                          {formatMoneyFromMinor(
                            item.amountMinor * item.quantity,
                            currency
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-6 text-center text-sm text-slate-500"
                      >
                        No line items found for this invoice.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <div className="w-full sm:w-80 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Amount Due
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatMoneyFromMinor(total, currency)}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-gray-300">
                  <span className="text-gray-900 font-semibold">
                    Total
                  </span>
                  <span className="text-gray-900 font-bold">
                    {formatMoneyFromMinor(total, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-card bg-white shadow-card border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4 text-slate-900">
              Payment Status
            </h3>

            {invoice?.payments?.length ? (
              <>
                <span className="inline-flex px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                  {invoice.payments[0].status}
                </span>

                <p className="text-gray-600 mt-3">
                  Paid on{" "}
                  <span className="font-medium text-gray-900">
                    {new Date(
                      invoice.payments[0].createdAt
                    ).toLocaleDateString()}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-sm text-slate-500">
                No payment information available for this invoice yet.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
