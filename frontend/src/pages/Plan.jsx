import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
} from "../api/plans";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPlan, setEditPlan] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    billingCycle: "MONTHLY",
    priceMinor: "",
    isMetered: false,
    description: "",
  });

  // Load plans
  const fetchPlans = async () => {
    try {
      const res = await getPlans();
      setPlans(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreate = async () => {
    if (!form.name || !form.priceMinor) {
      alert("Name & price are required");
      return;
    }

    try {
      await createPlan({
        ...form,
        priceMinor: Number(form.priceMinor) * 100, // convert to paise
      });
      alert("Plan created");
      setShowCreateModal(false);
      fetchPlans();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create plan");
    }
  };

  const handleUpdate = async () => {
    try {
      await updatePlan(editPlan.id, {
        ...form,
        priceMinor: Number(form.priceMinor) * 100,
      });
      alert("Plan updated");
      setShowEditModal(false);
      fetchPlans();
    } catch (err) {
      alert("Update failed");
    }
  };

  const openEditModal = (plan) => {
    setEditPlan(plan);
    setForm({
      name: plan.name,
      code: plan.code,
      billingCycle: plan.billingCycle,
      priceMinor: plan.priceMinor / 100,
      isMetered: plan.isMetered,
      description: plan.description || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this plan?")) return;

    try {
      await deletePlan(id);
      fetchPlans();
    } catch (_) {
      alert("Failed to delete");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full bg-[#F3F4F8]">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Plans</h1>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg shadow"
            >
              + Add Plan
            </button>
          </div>

          {/* PLANS TABLE */}
          <div className="bg-white border rounded-xl overflow-hidden shadow">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Billing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Metered
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      Loading...
                    </td>
                  </tr>
                ) : plans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No plans found
                    </td>
                  </tr>
                ) : (
                  plans.map((plan) => (
                    <tr key={plan.id} className="border-t">
                      <td className="px-6 py-4">{plan.name}</td>
                      <td className="px-6 py-4">₹{plan.priceMinor / 100}</td>
                      <td className="px-6 py-4">{plan.billingCycle}</td>
                      <td className="px-6 py-4">
                        {plan.isMetered ? "Yes" : "No"}
                      </td>
                      <td className="px-6 py-4 flex gap-3">
                        <button
                          onClick={() => openEditModal(plan)}
                          className="text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* CREATE PLAN MODAL */}
      {showCreateModal && (
        <PlanModal
          title="Create Plan"
          form={form}
          setForm={setForm}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}

      {/* EDIT PLAN MODAL */}
      {showEditModal && (
        <PlanModal
          title="Edit Plan"
          form={form}
          setForm={setForm}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
}

// REUSABLE MODAL COMPONENT
function PlanModal({ title, form, setForm, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>

        <input
          className="border p-2 rounded w-full mb-3"
          placeholder="Plan Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border p-2 rounded w-full mb-3"
          placeholder="Price"
          type="number"
          value={form.priceMinor}
          onChange={(e) => setForm({ ...form, priceMinor: e.target.value })}
        />

        <select
          className="border p-2 rounded w-full mb-3"
          value={form.billingCycle}
          onChange={(e) =>
            setForm({ ...form, billingCycle: e.target.value })
          }
        >
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </select>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={form.isMetered}
            onChange={(e) =>
              setForm({ ...form, isMetered: e.target.checked })
            }
          />
          Metered Billing
        </label>

        <textarea
          className="border p-2 rounded w-full mb-4"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
