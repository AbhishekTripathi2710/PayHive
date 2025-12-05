import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getWallet, creditWallet, debitWallet } from "../api/wallet";

function formatMoneyFromMinor(minor, currency = "INR") {
  if (minor == null) return "-";
  const major = minor / 100;
  return major.toLocaleString("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  });
}

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showDebitModal, setShowDebitModal] = useState(false);
  const navigate = useNavigate();

  const fetchWallet = async () => {
    try {
      const res = await getWallet();
      setWallet(res.data.data);
    } catch (err) {
      setError("Failed to load wallet.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#F3F4F8]">
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center justify-between gap-3">
              <div>
                <p className="text-slate-900 text-4xl font-black tracking-tight">
                  Wallet
                </p>
                <p className="text-slate-500">
                  Manage your wallet balance and transactions
                </p>
              </div>

              <div className="flex items-center gap-3">
                {loading && (
                  <span className="text-sm text-slate-500">Loading...</span>
                )}
                {error && <span className="text-sm text-red-500">{error}</span>}
                <button
                  onClick={() => setShowCreditModal(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-full shadow flex items-center gap-2 text-sm font-medium hover:bg-emerald-700"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Top Up
                </button>
                <button
                  onClick={() => setShowDebitModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-full shadow flex items-center gap-2 text-sm font-medium hover:bg-red-700"
                >
                  <span className="material-symbols-outlined text-sm">remove</span>
                  Debit
                </button>
              </div>
            </div>

            <div className="mb-8">
              <div className="rounded-card bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-white shadow-lg">
                <p className="text-emerald-100 text-sm font-semibold uppercase tracking-wide mb-2">
                  Current Balance
                </p>
                <p className="text-5xl font-bold">
                  {wallet
                    ? formatMoneyFromMinor(wallet.balanceMinor)
                    : "—"}
                </p>
              </div>
            </div>

            <div className="rounded-card border border-slate-200 bg-white shadow-card">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  Transaction History
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                        Description
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {!loading && wallet && wallet.transactions?.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-8 text-center text-sm text-slate-500"
                        >
                          No transactions found.
                        </td>
                      </tr>
                    )}

                    {wallet?.transactions?.map((tx) => {
                      const isCredit = tx.type === "CREDIT";
                      const amount = Math.abs(tx.amountMinor);

                      return (
                        <tr
                          key={tx.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {new Date(tx.createdAt).toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                isCredit
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {tx.description || "—"}
                          </td>
                          <td
                            className={`px-6 py-4 text-sm font-medium text-right ${
                              isCredit ? "text-emerald-600" : "text-red-600"
                            }`}
                          >
                            {isCredit ? "+" : "-"}
                            {formatMoneyFromMinor(amount)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {showCreditModal && (
        <CreditModal
          onClose={() => setShowCreditModal(false)}
          onSuccess={fetchWallet}
        />
      )}

      {showDebitModal && (
        <DebitModal
          onClose={() => setShowDebitModal(false)}
          onSuccess={fetchWallet}
          currentBalance={wallet?.balanceMinor || 0}
        />
      )}
    </div>
  );
}

function CreditModal({ onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      const amountMinor = Math.round(parseFloat(amount) * 100);
      await creditWallet(
        amountMinor,
        description || "Manual top-up"
      );
      alert("Wallet credited successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to credit wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Top Up Wallet</h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-1 text-sm text-slate-600">Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            placeholder="Enter amount"
            required
          />

          <label className="block mb-1 text-sm text-slate-600">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            placeholder="e.g. Top-up via bank transfer"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white rounded"
            >
              {loading ? "Processing..." : "Credit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DebitModal({ onClose, onSuccess, currentBalance }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const amountMinor = Math.round(parseFloat(amount) * 100);
    if (amountMinor > currentBalance) {
      alert("Insufficient balance");
      return;
    }

    try {
      setLoading(true);
      await debitWallet(
        amountMinor,
        description || "Manual debit"
      );
      alert("Wallet debited successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to debit wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Debit Wallet</h2>

        <div className="mb-4 p-3 bg-slate-50 rounded text-sm">
          <span className="text-slate-600">Available Balance: </span>
          <span className="font-semibold text-slate-900">
            {formatMoneyFromMinor(currentBalance)}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="block mb-1 text-sm text-slate-600">Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            max={currentBalance / 100}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            placeholder="Enter amount"
            required
          />

          <label className="block mb-1 text-sm text-slate-600">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            placeholder="e.g. Refund to customer"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              {loading ? "Processing..." : "Debit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

