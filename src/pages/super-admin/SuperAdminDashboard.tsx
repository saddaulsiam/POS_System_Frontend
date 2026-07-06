import React from "react";
import { useAdminStats } from "../../services/queries/adminQueries";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const SuperAdminDashboard: React.FC = () => {
  const { data, isLoading, error } = useAdminStats();

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
        <p>Failed to load platform statistics. Please check your backend connection.</p>
      </div>
    );
  }

  const { stats, recentStores, monthlyRegs } = data;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Find max registration for bar scaling
  const maxRegCount = Math.max(...monthlyRegs.map((r) => r.count), 1);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          System Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Global statistics and health of your multi-store POS platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Stores */}
        <div className="overflow-hidden rounded-xl bg-white p-5 shadow transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Total Stores
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                {stats.totalStores}
              </h3>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-600">
              🏢
            </span>
          </div>
          <div className="mt-4 flex gap-3 text-xs text-gray-500">
            <span className="font-semibold text-green-600">
              {stats.activeSubs} Active
            </span>
            <span>•</span>
            <span className="font-semibold text-indigo-600">
              {stats.trialSubs} Trial
            </span>
          </div>
        </div>

        {/* Monthly Recurring Revenue */}
        <div className="overflow-hidden rounded-xl bg-white p-5 shadow transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                MRR (Last 30 days)
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                {formatMoney(stats.mrr)}
              </h3>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-2xl text-green-600">
              🔁
            </span>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Estimated platform subscription revenue
          </div>
        </div>

        {/* Total Platform Revenue */}
        <div className="overflow-hidden rounded-xl bg-white p-5 shadow transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Total Revenue
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                {formatMoney(stats.totalRevenue)}
              </h3>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl text-indigo-600">
              💳
            </span>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Total validated payment logs
          </div>
        </div>

        {/* Platform Gross Sales (GMV) */}
        <div className="overflow-hidden rounded-xl bg-white p-5 shadow transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Gross Sales (GMV)
              </p>
              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                {formatMoney(stats.totalGMV)}
              </h3>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl text-amber-600">
              💰
            </span>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Total checkout sales processed by all stores
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Registration Chart Card */}
        <div className="rounded-xl bg-white p-6 shadow lg:col-span-1">
          <h3 className="text-lg font-bold text-gray-900">
            Store Registration Trends
          </h3>
          <p className="text-xs text-gray-500">Monthly signup numbers</p>
          <div className="mt-6 flex h-48 items-end gap-3 px-2">
            {monthlyRegs.map((m) => {
              const heightPercent = `${(m.count / maxRegCount) * 100}%`;
              return (
                <div
                  key={m.month}
                  className="group relative flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-t-md bg-indigo-500 transition-all hover:bg-indigo-600"
                    style={{ height: heightPercent, minHeight: "4px" }}
                    title={`${m.count} stores`}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-slate-900 px-1.5 py-0.5 text-4xs font-bold text-white opacity-0 transition-all group-hover:opacity-100">
                      {m.count}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-gray-600">
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Stores Card */}
        <div className="rounded-xl bg-white p-6 shadow lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900">
            Recently Registered Stores
          </h3>
          <p className="text-xs text-gray-500">Latest business signups</p>

          <div className="mt-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="text-left text-xs font-bold uppercase tracking-wider text-gray-400">
                    <th className="pb-3 pr-4 font-semibold">Store</th>
                    <th className="pb-3 px-4 font-semibold">Owner</th>
                    <th className="pb-3 px-4 font-semibold">Created Date</th>
                    <th className="pb-3 pl-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {recentStores.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-400">
                        No stores registered yet.
                      </td>
                    </tr>
                  ) : (
                    recentStores.map((store) => (
                      <tr key={store.id} className="hover:bg-slate-50">
                        <td className="py-3 pr-4">
                          <p className="font-bold text-gray-900">
                            {store.name}
                          </p>
                          <p className="text-xs text-gray-400">ID #{store.id}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium">{store.owner.name}</p>
                          <p className="text-xs text-gray-400">
                            {store.owner.email || "No email"}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500">
                          {new Date(store.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-2xs font-bold ${
                              store.subscription?.status === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : store.subscription?.status === "TRIAL"
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {store.subscription?.status || "NO PLAN"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
