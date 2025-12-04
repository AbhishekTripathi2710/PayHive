import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getSubscriptions } from "../api/subscription";
import { useNavigate } from "react-router-dom";

export default function Subscriptions() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubs = async () => {
            try {
                const res = await getSubscriptions();
                setSubscriptions(res.data.data || []);
            } catch (err) {
                setError("Failed to load subscriptions.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubs();
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
                                    Subscriptions
                                </p>
                                <p className="text-slate-500">
                                    Manage and view all customer subscriptions.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 text-sm">
                                {loading && (
                                    <span className="text-slate-500">Loading...</span>
                                )}
                                {error && <span className="text-red-500">{error}</span>}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 items-center mb-6">
                            <div className="relative w-full sm:w-96">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    search
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by ID, customer name..."
                                    className="w-full pl-10 pr-4 py-2 rounded-full bg-white border border-slate-200 text-gray-900 text-sm"
                                    disabled
                                />
                            </div>

                            <div className="flex gap-3">
                                <button className="px-4 py-2 rounded-full border bg-white text-sm text-gray-700 cursor-not-allowed flex items-center gap-1">
                                    Status
                                </button>
                                <button className="px-4 py-2 rounded-full border bg-white text-sm text-gray-700 cursor-not-allowed flex items-center gap-1">
                                    Plan
                                </button>
                            </div>

                            <button className="ml-auto px-4 py-2 bg-primary text-white rounded-full shadow cursor-not-allowed flex items-center gap-2 text-sm font-medium">
                                <span className="material-symbols-outlined text-sm">add</span>
                                Add Subscription
                            </button>
                        </div>

                        <div className="overflow-hidden rounded-card border border-slate-200 bg-white shadow-card">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr >
                                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                ID
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Plan / Customer
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Current Period End
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200">
                                        {!loading && subscriptions.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="px-6 py-8 text-center text-sm text-slate-500"
                                                >
                                                    No subscriptions found.
                                                </td>
                                            </tr>
                                        )}

                                        {subscriptions.map((sub) => {
                                            const status = (sub.status || "").toLowerCase();
                                            let statusStyle = "bg-gray-100 text-gray-800";
                                            if (status === "active") {
                                                statusStyle = "bg-green-100 text-green-800";
                                            } else if (status === "trialing") {
                                                statusStyle = "bg-blue-100 text-blue-800";
                                            } else if (
                                                status === "past_due" ||
                                                status === "cancel_at_period_end"
                                            ) {
                                                statusStyle = "bg-yellow-100 text-yellow-800";
                                            } else if (status === "canceled" || status === "paused") {
                                                statusStyle = "bg-red-100 text-red-800";
                                            }

                                            const periodEnd = sub.currentPeriodEnd
                                                ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                                                : "—";

                                            return (
                                                <tr
                                                    key={sub.id}
                                                    onClick={() => navigate(`/subscriptions/${sub.id}`)}
                                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                                >

                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        {sub.stripeId || `sub_${sub.id}`}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {sub.plan?.name || "—"}
                                                        <br />
                                                        <span className="text-xs text-gray-400">
                                                            {sub.user?.email}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyle}`}
                                                        >
                                                            {sub.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {periodEnd}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex items-center justify-center mt-6 gap-3 text-sm text-slate-500">
                            Pagination will appear here when server-side paging is added.
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
