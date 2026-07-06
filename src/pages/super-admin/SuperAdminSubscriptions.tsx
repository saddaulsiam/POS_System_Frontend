import React, { useState } from "react";
import { useAdminSubscriptions, useExtendSubscription } from "../../services/queries/adminQueries";
import { Pagination } from "../../components/sales/Pagination";
import { SkeletonTableRow } from "../../components/common";
import toast from "react-hot-toast";

const SuperAdminSubscriptions: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error, isFetching } = useAdminSubscriptions({
    page,
    limit,
    status: statusFilter || undefined,
  });

  const extendMutation = useExtendSubscription();

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset page on filter change
  };

  const handleExtend = async (subId: number, storeName: string, days: number) => {
    if (!window.confirm(`Are you sure you want to extend ${storeName}'s subscription by ${days} days?`)) {
      return;
    }
    try {
      await extendMutation.mutateAsync({ id: subId, days });
      toast.success(`Subscription for ${storeName} extended by ${days} days!`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to extend subscription");
    }
  };

  const getExpirationStatus = (sub: any) => {
    const now = new Date();
    
    // Check if grace period is active
    const expiredDate = sub.plan ? new Date(sub.subscriptionEndDate) : new Date(sub.trialEndDate);
    const diffTime = now.getTime() - expiredDate.getTime();
    const daysPast = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const isGracePeriod = sub.status === "EXPIRED" && daysPast >= 0 && daysPast <= (sub.gracePeriodDays || 0);
    
    if (isGracePeriod) {
      const graceDaysRemaining = (sub.gracePeriodDays || 0) - daysPast;
      return {
        label: `Grace Period (${graceDaysRemaining}d left)`,
        badgeClass: "bg-amber-100 text-amber-800 border border-amber-300 animate-pulse font-bold",
        daysRemaining: graceDaysRemaining,
        isExpired: false,
      };
    }

    let endDate: Date | null = null;
    if (sub.status === "TRIAL") {
      endDate = new Date(sub.trialEndDate);
    } else if (sub.status === "ACTIVE") {
      endDate = sub.subscriptionEndDate ? new Date(sub.subscriptionEndDate) : null;
    } else {
      endDate = sub.subscriptionEndDate ? new Date(sub.subscriptionEndDate) : new Date(sub.trialEndDate);
    }
    
    if (!endDate) {
      return {
        label: "Lifetime Active",
        badgeClass: "bg-green-100 text-green-800 border border-green-200 font-bold",
        daysRemaining: null,
        isExpired: false,
      };
    }
    
    const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
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
        badgeClass: "bg-orange-100 text-orange-800 border border-orange-200 animate-pulse font-bold",
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
        <p>Failed to load subscription list. Please check your backend connection.</p>
      </div>
    );
  }

  const subscriptions = data?.data || [];
  const pagination = data?.pagination || { totalPages: 1 };
  const summary = data?.summary || { totalPaid: 0, totalTrial: 0, totalExpired: 0, totalExpiringSoon: 0 };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Subscriptions Lifecycle
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Track SaaS trials, plan statuses, and billing dates.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Paid */}
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Paid
            </span>
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-3xs font-bold text-green-700 border border-green-150">
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
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-3xs font-bold text-indigo-700 border border-indigo-150">
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
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-3xs font-bold text-red-700 border border-red-150">
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
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-3xs font-bold text-orange-700 border border-orange-150 animate-pulse">
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
      <div className="flex rounded-xl bg-white p-4 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-700">Filter Status:</label>
          <select
            className="rounded-lg border border-gray-300 bg-slate-50 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="TRIAL">Trial Mode</option>
            <option value="ACTIVE">Paid / Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Subscription Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow border border-slate-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Store / Owner</th>
                <th className="px-6 py-4 font-semibold">Subscription Status</th>
                <th className="px-6 py-4 font-semibold">Billing Plan</th>
                <th className="px-6 py-4 font-semibold">Trial Duration</th>
                <th className="px-6 py-4 font-semibold">Subscription Cycle</th>
                <th className="px-6 py-4 font-semibold text-center">Grace Period</th>
                <th className="px-6 py-4 text-center font-semibold">Quick Actions</th>
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
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{sub.store.name}</p>
                        <p className="text-xs text-gray-500">Owner: {sub.store.owner.name}</p>
                        {sub.store.owner.email && (
                          <p className="text-2xs text-indigo-600 mt-0.5">{sub.store.owner.email}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-2xs ${statusInfo.badgeClass}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-2xs font-bold text-slate-800 uppercase">
                          {sub.plan || "NO PLAN"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        <div>Start: {new Date(sub.trialStartDate).toLocaleDateString()}</div>
                        <div className="font-semibold text-indigo-600 mt-0.5">
                          End: {new Date(sub.trialEndDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {sub.subscriptionStartDate ? (
                          <>
                            <div>Start: {new Date(sub.subscriptionStartDate).toLocaleDateString()}</div>
                            <div className="font-semibold text-green-700 mt-0.5">
                              End: {sub.subscriptionEndDate ? new Date(sub.subscriptionEndDate).toLocaleDateString() : "Lifetime"}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400">Not Subscribed Yet</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-700">
                        {sub.gracePeriodDays || 0} days
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleExtend(sub.id, sub.store.name, 7)}
                            disabled={extendMutation.isPending}
                            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-50 transition-all shadow-sm"
                          >
                            ➕ 7 Days
                          </button>
                          <button
                            onClick={() => handleExtend(sub.id, sub.store.name, 30)}
                            disabled={extendMutation.isPending}
                            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
                          >
                            ➕ 30 Days
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
          <div className="border-t border-gray-150 p-4">
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminSubscriptions;
