import React, { useState } from "react";
import {
  useAdminPromoCodes,
  useCreatePromoCode,
  useUpdatePromoCode,
  useTogglePromoCode,
  useDeletePromoCode,
} from "../../services/queries/adminQueries";
import { Pagination } from "../../components/sales/Pagination";
import toast from "react-hot-toast";
import {
  Ticket,
  Plus,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Calendar,
  PencilLine,
} from "lucide-react";

const SuperAdminPromoCodes: React.FC = () => {
  const { data: promoCodes, isLoading, isError } = useAdminPromoCodes();
  const createMutation = useCreatePromoCode();
  const updateMutation = useUpdatePromoCode();
  const toggleMutation = useTogglePromoCode();
  const deleteMutation = useDeletePromoCode();

  // Create Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [code, setCode] = useState("");
  const [type, setType] = useState("PERCENTAGE");
  const [value, setValue] = useState(10);
  const [applicablePlan, setApplicablePlan] = useState("ALL");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [editingPromoId, setEditingPromoId] = useState<number | null>(null);

  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const resetForm = () => {
    setCode("");
    setType("PERCENTAGE");
    setValue(10);
    setApplicablePlan("ALL");
    setMaxUses("");
    setExpiresAt("");
    setEditingPromoId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleOpenEdit = (promo: any) => {
    setCode(promo.code);
    setType(promo.type);
    setValue(promo.value);
    setApplicablePlan(promo.applicablePlan);
    setMaxUses(promo.maxUses ? promo.maxUses.toString() : "");
    setExpiresAt(
      promo.expiresAt
        ? new Date(promo.expiresAt).toISOString().split("T")[0]
        : "",
    );
    setEditingPromoId(promo.id);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || value <= 0) {
      toast.error("Code and valid positive values are required!");
      return;
    }

    try {
      await createMutation.mutateAsync({
        code: code.toUpperCase().trim(),
        type,
        value: parseFloat(value.toString()),
        applicablePlan,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt || null,
      });

      toast.success("Promo code created successfully!");
      handleCloseModal();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create promo code");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromoId || !code.trim() || value <= 0) {
      toast.error("Code and valid positive values are required!");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: editingPromoId,
        promo: {
          code: code.toUpperCase().trim(),
          type,
          value: parseFloat(value.toString()),
          applicablePlan,
          maxUses: maxUses ? parseInt(maxUses) : null,
          expiresAt: expiresAt || null,
        },
      });

      toast.success("Promo code updated successfully!");
      handleCloseModal();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update promo code");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleMutation.mutateAsync(id);
      toast.success("Promo code status updated");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to update status");
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this promo code?",
      )
    ) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Promo code deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete promo code");
    }
  };

  // Pagination Helper
  const totalItems = promoCodes?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedCodes =
    promoCodes?.slice((page - 1) * itemsPerPage, page * itemsPerPage) || [];

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="text-lg font-bold">Error</h3>
        <p>
          Failed to load promo codes. Make sure the database schema changes are
          generated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Promo Codes & Coupons
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create discount keys, checkout percentage reductions, or free trial
            extension vouchers.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow transition-all hover:scale-[1.02] hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Create Promo Code
        </button>
      </div>

      {/* Main Codes Table Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-gray-500">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-gray-600">
              <tr>
                <th className="px-6 py-4">Promo Code</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Applies To</th>
                <th className="px-6 py-4 text-center">Usages</th>
                <th className="px-6 py-4">Expires At</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCodes.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-10 text-center font-semibold text-gray-400"
                  >
                    No promo codes created yet. Click "Create Promo Code" to add
                    one.
                  </td>
                </tr>
              ) : (
                paginatedCodes.map((promo) => (
                  <tr
                    key={promo.id}
                    className="transition-colors hover:bg-slate-50/50"
                  >
                    <td className="px-6 py-4 font-black tracking-wide text-slate-800">
                      <span className="rounded border border-indigo-100 bg-indigo-50 px-2.5 py-1 font-mono text-xs text-indigo-700">
                        {promo.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold uppercase text-slate-600">
                      {promo.type === "PERCENTAGE" && "Percentage Discount"}
                      {promo.type === "FIXED" && "Fixed Cash Discount"}
                      {promo.type === "TRIAL_EXTENSION" && "Trial Extension"}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">
                      {promo.type === "PERCENTAGE" && `${promo.value}%`}
                      {promo.type === "FIXED" && `$${promo.value.toFixed(2)}`}
                      {promo.type === "TRIAL_EXTENSION" &&
                        `${promo.value} Days`}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold uppercase text-slate-600">
                      {promo.applicablePlan === "ALL" && "All Plans"}
                      {promo.applicablePlan === "MONTHLY" && "Monthly Only"}
                      {promo.applicablePlan === "YEARLY" && "Yearly Only"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold text-slate-700">
                        {promo.usedCount}
                      </span>
                      <span className="text-xs text-slate-400">
                        {promo.maxUses ? ` / ${promo.maxUses}` : " / ∞"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {promo.expiresAt ? (
                        <span className="flex items-center gap-1.5 font-semibold text-slate-600">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(promo.expiresAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">Never Expires</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggle(promo.id)}
                        disabled={toggleMutation.isPending}
                        className="text-slate-600 transition-all hover:text-indigo-600 disabled:opacity-50"
                      >
                        {promo.isActive ? (
                          <ToggleRight className="h-7 w-7 text-indigo-600" />
                        ) : (
                          <ToggleLeft className="h-7 w-7 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(promo)}
                        className="mr-3 rounded-lg p-2 text-slate-400 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <PencilLine className="h-4.5 w-4.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(promo.id)}
                        disabled={deleteMutation.isPending}
                        className="rounded-lg p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-100 p-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="flex items-center gap-2 text-lg font-black text-gray-900">
                <Ticket className="h-5 w-5 text-indigo-500" />
                {editingPromoId ? "Edit Promo Code" : "Create New Promo Code"}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="font-semibold text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={editingPromoId ? handleUpdate : handleCreate}
              className="space-y-4"
            >
              {/* Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-600">
                  Coupon Code Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WELCOME50"
                  className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2 text-sm font-black uppercase tracking-wider focus:border-indigo-500 focus:outline-none"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                />
              </div>

              {/* Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600">
                    Discount Type
                  </label>
                  <select
                    className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2 text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                    <option value="TRIAL_EXTENSION">
                      Trial Extension (Days)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600">
                    Discount Value / Days
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2 text-sm font-bold focus:border-indigo-500 focus:outline-none"
                    value={value}
                    onChange={(e) => setValue(parseFloat(e.target.value))}
                  />
                </div>
              </div>

              {/* Applicable Plan Restriction */}
              {type !== "TRIAL_EXTENSION" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600">
                    Applicable Subscription Plan
                  </label>
                  <select
                    className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2 text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                    value={applicablePlan}
                    onChange={(e) => setApplicablePlan(e.target.value)}
                  >
                    <option value="ALL">All Subscription Plans</option>
                    <option value="MONTHLY">Monthly Plan Only</option>
                    <option value="YEARLY">Yearly Plan Only</option>
                  </select>
                </div>
              )}

              {/* Max Uses & Expiry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600">
                    Max Allowed Uses (Optional)
                  </label>
                  <input
                    type="number"
                    min={1}
                    placeholder="Leave empty for unlimited"
                    className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2 text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-600">
                    Expiration Date (Optional)
                  </label>
                  <input
                    type="date"
                    className="mt-2 block w-full rounded-lg border border-gray-300 bg-slate-50 px-3 py-2 text-sm font-semibold focus:border-indigo-500 focus:outline-none"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-indigo-700"
                >
                  {editingPromoId
                    ? updateMutation.isPending
                      ? "Updating..."
                      : "Update Promo Code"
                    : createMutation.isPending
                      ? "Creating..."
                      : "Save Promo Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPromoCodes;
