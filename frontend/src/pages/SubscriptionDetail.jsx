import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  getSubscriptionDetail,
  getUsageEvents,
  pauseSubscription,
  resumeSubscription,
  cancelSubscription,
  changePlan,
  addUsageEvent,
} from "../api/subscriptionDetail";

import { getPlans } from "../api/plans";

export default function SubscriptionDetail() {
  const { id } = useParams();

  // UI States
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);

  // Data States
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState("");

  const [metric, setMetric] = useState("");
  const [quantity, setQuantity] = useState("");

  const [sub, setSub] = useState(null);
  const [usage, setUsage] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // Load: subscription + usage + plans
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailRes, usageRes, plansRes] = await Promise.all([
          getSubscriptionDetail(id),
          getUsageEvents(id),
          getPlans(),
        ]);

        setSub(detailRes.data.data);
        setUsage(usageRes.data.data || []);
        setPlans(plansRes.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load subscription.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Pause Subscription
  const handlePause = async () => {
    setActionLoading(true);
    try {
      await pauseSubscription(id);
      setSub({ ...sub, status: "paused" });
    } catch {
      alert("Failed to pause subscription.");
    } finally {
      setActionLoading(false);
    }
  };

  // Resume Subscription
  const handleResume = async () => {
    setActionLoading(true);
    try {
      await resumeSubscription(id);
      setSub({ ...sub, status: "active" });
    } catch {
      alert("Failed to resume subscription.");
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel Subscription
  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this subscription?")) return;

    setActionLoading(true);
    try {
      await cancelSubscription(id);
      setSub({ ...sub, status: "canceled" });
    } catch {
      alert("Failed to cancel subscription.");
    } finally {
      setActionLoading(false);
    }
  };

  // Change Plan Handler
  const handleChangePlan = async () => {
    if (!selectedPlanId) return alert("Select a plan first!");

    setActionLoading(true);

    try {
      await changePlan(id, selectedPlanId);

      const updatedPlan = plans.find((p) => p.id === Number(selectedPlanId));

      setSub({
        ...sub,
        plan: updatedPlan,
      });

      alert("Plan updated successfully!");
      setShowPlanModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to change plan.");
    }

    setActionLoading(false);
  };

  // Add Usage Event
  const handleAddUsage = async () => {
    if (!metric || !quantity) return alert("Metric and quantity required.");
    if (quantity <= 0) return alert("Quantity must be greater than 0.");

    setActionLoading(true);

    try {
      const res = await addUsageEvent(id, metric, Number(quantity));

      setUsage([res.data.data.usageEvent, ...usage]);

      alert("Usage recorded successfully!");
      setShowUsageModal(false);

      setMetric("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      alert("Failed to add usage.");
    }

    setActionLoading(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-500">
        Loading subscription...
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error || "Subscription not found."}
      </div>
    );
  }

  const statusColor = {
    active: "bg-green-100 text-green-800",
    trialing: "bg-blue-100 text-blue-800",
    past_due: "bg-yellow-100 text-yellow-800",
    paused: "bg-red-100 text-red-800",
    canceled: "bg-red-200 text-red-700",
  }[sub.status] || "bg-gray-100 text-gray-800";

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#F3F4F8]">
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-5xl">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-3xl font-black text-slate-900">
                  Subscription Detail
                </p>
                <p className="text-slate-500">{sub.stripeId}</p>
              </div>

              <span className={`px-4 py-1 rounded-full text-sm ${statusColor}`}>
                {sub.status}
              </span>
            </div>

            {/* MAIN CARD */}
            <div className="bg-white border rounded-xl p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Customer</p>
                    <p className="font-medium text-slate-900">
                      {sub.user?.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Plan</p>
                    <p className="font-medium text-slate-900">
                      {sub.plan?.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Billing Cycle</p>
                    <p className="font-medium text-slate-900">
                      {sub.plan?.billingCycle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Current Period</p>
                    <p className="font-medium text-slate-900">
                      {new Date(sub.currentPeriodStart).toLocaleDateString()} →{" "}
                      {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Amount</p>
                    <p className="font-medium text-slate-900">
                      ₹{sub.plan?.priceMinor / 100}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-6 flex gap-3">
                {sub.status === "active" && (
                  <button
                    onClick={handlePause}
                    disabled={actionLoading}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow text-sm"
                  >
                    Pause
                  </button>
                )}

                {sub.status === "paused" && (
                  <button
                    onClick={handleResume}
                    disabled={actionLoading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow text-sm"
                  >
                    Resume
                  </button>
                )}

                {sub.status !== "canceled" && (
                  <button
                    onClick={handleCancel}
                    disabled={actionLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg shadow text-sm"
                  >
                    Cancel Subscription
                  </button>
                )}

                <button
                  onClick={() => setShowPlanModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow text-sm"
                >
                  Change Plan
                </button>

                <button
                  onClick={() => setShowUsageModal(true)}
                  className="bg-primary text-white px-4 py-2 rounded-lg shadow text-sm"
                >
                  Add Usage
                </button>
              </div>
            </div>

            {/* USAGE EVENTS */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xl font-semibold">Usage Events</p>
              </div>

              <div className="overflow-hidden rounded-lg border bg-white">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                        Metric
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase text-slate-500">
                        Quantity
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {usage.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-6 text-center text-slate-500"
                        >
                          No usage events yet.
                        </td>
                      </tr>
                    ) : (
                      usage.map((u) => (
                        <tr key={u.id}>
                          <td className="px-6 py-4 text-sm">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm">{u.metric}</td>
                          <td className="px-6 py-4 text-sm">{u.quantity}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* CHANGE PLAN MODAL */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Change Plan</h2>

            <select
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">Select new plan</option>
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} — ₹{plan.priceMinor / 100}/{plan.billingCycle}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPlanModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleChangePlan}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Update Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD USAGE MODAL */}
      {showUsageModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Record Usage</h2>

            <label className="text-sm text-slate-600">Metric</label>
            <input
              type="text"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              placeholder="e.g. api_calls"
              className="w-full border p-2 rounded mb-4"
            />

            <label className="text-sm text-slate-600">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 50"
              className="w-full border p-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowUsageModal(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddUsage}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Add Usage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
