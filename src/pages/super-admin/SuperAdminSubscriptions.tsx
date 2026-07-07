import React, { useState, useEffect } from "react";
import {
  useAdminSubscriptions,
  useExtendSubscription,
  useUpdateSubscription,
} from "../../services/queries/adminQueries";
import { Pagination } from "../../components/sales/Pagination";
import { SkeletonTableRow, Modal } from "../../components/common";
import toast from "react-hot-toast";
import { Filter, Search, RefreshCw, X } from "lucide-react";

const SuperAdminSubscriptions: React.FC = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("");
    setPlanFilter("");
    setPage(1);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading, error, isFetching, refetch } = useAdminSubscriptions(
    {
      page,
      limit,
      search: debouncedSearch || undefined,
      status: statusFilter || undefined,
      plan: planFilter || undefined,
    },
  );

  const extendMutation = useExtendSubscription();
  const updateSubMutation = useUpdateSubscription();

  // Override Form States
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [subStatus, setSubStatus] = useState("");
  const [subPlan, setSubPlan] = useState("");
  const [subEndDate, setSubEndDate] = useState("");
  const [subGracePeriod, setSubGracePeriod] = useState(0);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handleExtend = async (
    subId: number,
    storeName: string,
    days: number,
  ) => {
    if (
      !window.confirm(
        `Are you sure you want to extend ${storeName}'s subscription by ${days} days?`,
      )
    ) {
      return;
    }
    try {
      await extendMutation.mutateAsync({ id: subId, days });
      toast.success(`Subscription for ${storeName} extended by ${days} days!`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to extend subscription");
    }
  };

  const handleUpdateSubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      await updateSubMutation.mutateAsync({
        id: selectedSub.storeId,
        status: subStatus,
        plan: subPlan,
        endDate: subEndDate || null,
        gracePeriodDays: subGracePeriod,
      });
      toast.success("Subscription overridden successfully!");
      setSelectedSub(null);
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Failed to override subscription",
      );
    }
  };

  const getExpirationStatus = (sub: any) => {
    const now = new Date();

    // Check if grace period is active
    const expiredDate = sub.plan
      ? new Date(sub.subscriptionEndDate)
      : new Date(sub.trialEndDate);
    const diffTime = now.getTime() - expiredDate.getTime();
    const daysPast = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const isGracePeriod =
      sub.status === "EXPIRED" &&
      daysPast >= 0 &&
      daysPast <= (sub.gracePeriodDays || 0);

    if (isGracePeriod) {
      const graceDaysRemaining = (sub.gracePeriodDays || 0) - daysPast;
      return {
        label: `Grace Period (${graceDaysRemaining}d left)`,
        badgeClass:
          "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse font-bold",
        daysRemaining: graceDaysRemaining,
        isExpired: false,
      };
    }

    let endDate: Date | null = null;
    if (sub.status === "TRIAL") {
      endDate = new Date(sub.trialEndDate);
    } else if (sub.status === "ACTIVE") {
      endDate = sub.subscriptionEndDate
        ? new Date(sub.subscriptionEndDate)
        : null;
    } else {
      endDate = sub.subscriptionEndDate
        ? new Date(sub.subscriptionEndDate)
        : new Date(sub.trialEndDate);
    }

    if (!endDate) {
      return {
        label: "Lifetime Active",
        badgeClass:
          "bg-green-100 text-green-800 border border-green-200 font-bold",
        daysRemaining: null,
        isExpired: false,
      };
    }

    const diffDays = Math.ceil(
      (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) {
      return {
        label: `Expired`,
        badgeClass: "bg-red-100 text-red-800 border border-red-200 font-bold",
        daysRemaining: diffDays,
        isExpired: true,
      };
    } else if (diffDays <= 3) {
      return {
        label: `Expiring Soon (${diffDays}d)`,
        badgeClass:
          "bg-orange-100 text-orange-800 border border-orange-200 animate-pulse font-bold",
        daysRemaining: diffDays,
        isExpired: false,
      };
    } else {
      const isPaid = sub.status === "ACTIVE";
      return {
        label: `${sub.status} (${diffDays}d left)`,
        badgeClass: isPaid
          ? "bg-green-100 text-green-800 border border-green-200 font-semibold"
          : "bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold",
        daysRemaining: diffDays,
        isExpired: false,
      };
    }
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="text-lg font-bold">Error</h3>
        <p>
          Failed to load subscription list. Please check your backend
          connection.
        </p>
      </div>
    );
  }

  const subscriptions = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };
  const summary = data?.summary || {
    totalPaid: 0,
    totalTrial: 0,
    totalExpired: 0,
    totalExpiringSoon: 0,
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Subscriptions Lifecycle
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track SaaS trials, plan statuses, and billing dates.
          </p>
        </div>
        <button
          onClick={() => setShowInfoModal(true)}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50"
        >
          ℹ️ How It Works
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Paid */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Paid
            </span>
            <span className="text-3xs border-green-150 rounded-full border bg-green-50 px-2 py-0.5 font-bold text-green-700">
              🟢 Paid
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">
              {summary.totalPaid}
            </span>
            <span className="text-xs text-slate-400">Stores</span>
          </div>
        </div>

        {/* Active Trials */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Trials
            </span>
            <span className="text-3xs border-indigo-150 rounded-full border bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700">
              🧪 Testing
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">
              {summary.totalTrial}
            </span>
            <span className="text-xs text-slate-400">Stores</span>
          </div>
        </div>

        {/* Expired / Cancelled */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Expired / Cancelled
            </span>
            <span className="text-3xs border-red-150 rounded-full border bg-red-50 px-2 py-0.5 font-bold text-red-700">
              🔴 Inactive
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">
              {summary.totalExpired}
            </span>
            <span className="text-xs text-slate-400">Stores</span>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Expiring Soon
            </span>
            <span className="text-3xs border-orange-150 animate-pulse rounded-full border bg-orange-50 px-2 py-0.5 font-bold text-orange-700">
              ⚠️ &lt; 3 Days
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">
              {summary.totalExpiringSoon}
            </span>
            <span className="text-xs text-slate-400">Stores</span>
          </div>
        </div>
      </div>

      {/* Filter and select */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-lg border border-gray-300 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Search by store name, owner, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              id="subscription-status-filter"
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-slate-50 py-2 pl-3 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="TRIAL">Trial Mode</option>
              <option value="ACTIVE">Active / Paid</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="relative">
            <select
              id="subscription-plan-filter"
              className="block w-full appearance-none rounded-lg border border-gray-300 bg-slate-50 py-2 pl-3 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Plans</option>
              <option value="MONTHLY">Monthly</option>
              <option value="YEARLY">Yearly</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <Filter className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-red-500 hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            title="Clear Filters"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-slate-50 p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            title="Refresh"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Subscription Table */}
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Store / Owner</th>
                <th className="px-6 py-4 font-semibold">Subscription Status</th>
                <th className="px-6 py-4 font-semibold">Billing Plan</th>
                <th className="px-6 py-4 font-semibold">Trial Duration</th>
                <th className="px-6 py-4 font-semibold">Subscription Cycle</th>
                <th className="px-6 py-4 text-center font-semibold">
                  Grace Period
                </th>
                <th className="px-6 py-4 text-center font-semibold">
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {isLoading || isFetching ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonTableRow key={index} columns={7} />
                ))
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    No subscriptions found matching this filter.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => {
                  const statusInfo = getExpirationStatus(sub);
                  return (
                    <tr
                      key={sub.id}
                      className="transition-colors hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">
                          {sub.store.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Owner: {sub.store.owner.name}
                        </p>
                        {sub.store.owner.email && (
                          <p className="mt-0.5 text-xs text-indigo-600">
                            {sub.store.owner.email}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs ${statusInfo.badgeClass}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase text-slate-800">
                          {sub.plan || "NO PLAN"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        <div>
                          Start:{" "}
                          {new Date(sub.trialStartDate).toLocaleDateString()}
                        </div>
                        <div className="mt-0.5 font-semibold text-indigo-600">
                          End: {new Date(sub.trialEndDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {sub.subscriptionStartDate ? (
                          <>
                            <div>
                              Start:{" "}
                              {new Date(
                                sub.subscriptionStartDate,
                              ).toLocaleDateString()}
                            </div>
                            <div className="mt-0.5 font-semibold text-green-700">
                              End:{" "}
                              {sub.subscriptionEndDate
                                ? new Date(
                                    sub.subscriptionEndDate,
                                  ).toLocaleDateString()
                                : "Lifetime"}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400">
                            Not Subscribed Yet
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-700">
                        {sub.gracePeriodDays || 0} days
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleExtend(sub.id, sub.store.name, 7)
                            }
                            disabled={extendMutation.isPending}
                            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow-sm transition-all hover:bg-indigo-100 disabled:opacity-50"
                          >
                            ➕ 7 Days
                          </button>
                          {/* <button
                            onClick={() =>
                              handleExtend(sub.id, sub.store.name, 30)
                            }
                            disabled={extendMutation.isPending}
                            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50"
                          >
                            ➕ 30 Days
                          </button> */}
                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setSubStatus(sub.status);
                              setSubPlan(sub.plan || "MONTHLY");
                              setSubEndDate(
                                sub.subscriptionEndDate
                                  ? new Date(sub.subscriptionEndDate)
                                      .toISOString()
                                      .split("T")[0]
                                  : "",
                              );
                              setSubGracePeriod(sub.gracePeriodDays || 0);
                            }}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-100"
                          >
                            ⚙️ Settings
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="border-gray-150 border-t p-4">
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Subscription Override Modal */}
      <Modal
        isOpen={!!selectedSub}
        onClose={() => setSelectedSub(null)}
        title={`Override Settings: ${selectedSub?.store.name}`}
        size="md"
      >
        {selectedSub && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
              <h4 className="border-b border-gray-100 pb-2 text-sm font-bold uppercase tracking-wider text-gray-500">
                🏢 Store Info
              </h4>
              <div className="mt-3 space-y-2 text-xs text-gray-700">
                <p>
                  <span className="font-semibold text-gray-400">
                    Owner Name:
                  </span>{" "}
                  {selectedSub.store.owner.name}
                </p>
                <p>
                  <span className="font-semibold text-gray-400">
                    Current Status:
                  </span>{" "}
                  <span className="text-indigo-650 font-bold">
                    {selectedSub.status}
                  </span>
                </p>
              </div>
            </div>

            <form onSubmit={handleUpdateSubSubmit} className="space-y-4">
              {/* Status Toggle */}
              <div>
                <label className="block text-xs font-bold text-gray-600">
                  Subscription Status
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  value={subStatus}
                  onChange={(e) => setSubStatus(e.target.value)}
                >
                  <option value="TRIAL">Trial Mode</option>
                  <option value="ACTIVE">Active / Paid</option>
                  <option value="EXPIRED">Expired</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Plan Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-600">
                  Plan Type
                </label>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  value={subPlan}
                  onChange={(e) => setSubPlan(e.target.value)}
                >
                  <option value="MONTHLY">Monthly Billing</option>
                  <option value="YEARLY">Yearly Billing</option>
                  <option value="LIFETIME">Lifetime Billing</option>
                </select>
              </div>

              {/* End Date Input */}
              <div>
                <label className="block text-xs font-bold text-gray-600">
                  Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  value={subEndDate}
                  onChange={(e) => setSubEndDate(e.target.value)}
                />
              </div>

              {/* Grace Period Input */}
              <div>
                <label className="block text-xs font-bold text-gray-600">
                  Grace Period (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none"
                  value={subGracePeriod}
                  onChange={(e) =>
                    setSubGracePeriod(parseInt(e.target.value) || 0)
                  }
                />
              </div>

              {/* Submit Override */}
              <div className="border-t border-gray-100 pt-4 text-right">
                <button
                  type="submit"
                  disabled={updateSubMutation.isPending}
                  className="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  Save Override
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Help / Information Modal */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="SaaS Subscription Guide"
      >
        <div className="space-y-4 text-sm text-slate-700">
          <p className="border-b border-slate-100 pb-2 text-xs text-slate-500">
            Understand how store subscription lifecycles, states, and grace
            periods function.
          </p>

          {/* Subscription States */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              🔄 Subscription States
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 p-2.5">
                <p className="font-bold text-indigo-800">
                  🧪 Trial Mode (TRIAL)
                </p>
                <p className="mt-1 text-slate-600">
                  New signups default to a 10-day trial. Stores have full access
                  during this testing window.
                </p>
              </div>
              <div className="rounded-lg border border-green-100 bg-green-50/50 p-2.5">
                <p className="font-bold text-green-800">
                  🟢 Paid / Active (ACTIVE)
                </p>
                <p className="mt-1 text-slate-600">
                  Paid billing accounts on Monthly, Yearly, or Lifetime plans.
                  Unrestricted POS checkouts.
                </p>
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-2.5">
                <p className="font-bold text-amber-800">
                  ⚠️ Grace Period (EXPIRED with buffer)
                </p>
                <p className="mt-1 text-slate-600">
                  An administrative buffer. If a billing cycle expires, the
                  store remains active for cashier sales until the grace period
                  runs out.
                </p>
              </div>
              <div className="rounded-lg border border-red-100 bg-red-50/50 p-2.5">
                <p className="font-bold text-red-800">
                  🔴 Expired / Blocked (EXPIRED)
                </p>
                <p className="mt-1 text-slate-600">
                  Trial or billing period has expired. Cashiers are blocked at
                  routing level until a renewal is completed.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 border-t border-slate-100 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              ⚡ Administrative Controls
            </h4>
            <div className="space-y-2 text-xs text-slate-600">
              <p>
                <span className="font-bold text-slate-700">➕ 7 Days:</span>{" "}
                One-click extensions. Instantly grants additional days to the
                merchant's cycle without affecting their plan tier.
              </p>
              <p>
                <span className="font-bold text-slate-700">⚙️ Override:</span>{" "}
                Full lifecycle overrides. Allows you to manually change plan
                status, billing intervals, calendar expiration dates, and grace
                period buffer days.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SuperAdminSubscriptions;
