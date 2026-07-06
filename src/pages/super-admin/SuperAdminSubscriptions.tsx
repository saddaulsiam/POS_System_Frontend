import React, { useState } from "react";
import { useAdminSubscriptions } from "../../services/queries/adminQueries";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { Pagination } from "../../components/sales/Pagination";

const SuperAdminSubscriptions: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useAdminSubscriptions({
    page,
    limit,
    status: statusFilter || undefined,
  });

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1); // Reset page on filter change
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-red-700">
        <h3 className="text-lg font-bold">Error</h3>
        <p>Failed to load subscription list. Please check your backend connection.</p>
      </div>
    );
  }

  const { data: subscriptions, pagination } = data;

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

      {/* Filter and select */}
      <div className="flex rounded-xl bg-white p-4 shadow">
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
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Store / Owner</th>
                <th className="px-6 py-4 font-semibold">Subscription Status</th>
                <th className="px-6 py-4 font-semibold">Billing Plan</th>
                <th className="px-6 py-4 font-semibold">Trial Duration</th>
                <th className="px-6 py-4 font-semibold">Subscription Cycle</th>
                <th className="px-6 py-4 font-semibold text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    No subscriptions found matching this filter.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{sub.store.name}</p>
                      <p className="text-xs text-gray-500">Owner: {sub.store.owner.name}</p>
                      {sub.store.owner.email && (
                        <p className="text-2xs text-gray-400">{sub.store.owner.email}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-2xs font-bold ${
                          sub.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : sub.status === "TRIAL"
                              ? "bg-indigo-100 text-indigo-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">
                        {sub.plan || "NO PLAN SELECTED"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      <div>Start: {new Date(sub.trialStartDate).toLocaleDateString()}</div>
                      <div className="font-semibold text-indigo-700">
                        End: {new Date(sub.trialEndDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {sub.subscriptionStartDate ? (
                        <>
                          <div>Start: {new Date(sub.subscriptionStartDate).toLocaleDateString()}</div>
                          <div className="font-semibold text-green-700">
                            End: {sub.subscriptionEndDate ? new Date(sub.subscriptionEndDate).toLocaleDateString() : "Lifetime"}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">Not Subscribed Yet</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-gray-500">
                      {new Date(sub.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
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
