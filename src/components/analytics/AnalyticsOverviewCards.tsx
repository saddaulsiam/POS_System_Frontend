import React from "react";
import { OverviewData } from "../../types/analyticsTypes";
import { formatCurrency } from "../../utils/currencyUtils";

interface AnalyticsOverviewCardsProps {
  overviewData: OverviewData;
  settings: any;
}

export const AnalyticsOverviewCards: React.FC<AnalyticsOverviewCardsProps> = ({
  overviewData,
  settings,
}) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Revenue */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 p-6 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
            <span className="text-xl">💰</span>
          </div>
          {overviewData.growth.revenue !== 0 && (
            <div
              className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${
                overviewData.growth.revenue > 0
                  ? "bg-emerald-500/20 text-emerald-100"
                  : "bg-rose-500/20 text-rose-100"
              }`}
            >
              <span>{overviewData.growth.revenue > 0 ? "↑" : "↓"}</span>
              <span>{Math.abs(overviewData.growth.revenue).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="mb-1 text-3xl font-extrabold tracking-tight">
          {formatCurrency(
            Number(overviewData.metrics.totalRevenue),
            settings,
            2,
          )}
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-100">
          Total Revenue
        </div>
      </div>

      {/* Total Transactions */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 p-6 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
            <span className="text-xl">🛒</span>
          </div>
          {overviewData.growth.sales !== 0 && (
            <div
              className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${
                overviewData.growth.sales > 0
                  ? "bg-emerald-500/20 text-emerald-100"
                  : "bg-rose-500/20 text-rose-100"
              }`}
            >
              <span>{overviewData.growth.sales > 0 ? "↑" : "↓"}</span>
              <span>{Math.abs(overviewData.growth.sales).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className="mb-1 text-3xl font-extrabold tracking-tight">
          {Number(overviewData.metrics.totalSales).toLocaleString()}
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-100">
          Total Transactions
        </div>
      </div>

      {/* Average Order Value */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-fuchsia-600 p-6 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
            <span className="text-xl">💸</span>
          </div>
        </div>
        <div className="mb-1 text-3xl font-extrabold tracking-tight">
          {formatCurrency(
            Number(overviewData.metrics.averageOrderValue),
            settings,
            2,
          )}
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-violet-100">
          Average Order Value
        </div>
      </div>

      {/* Unique Customers */}
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-6 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10">
            <span className="text-xl">👥</span>
          </div>
        </div>
        <div className="mb-1 text-3xl font-extrabold tracking-tight">
          {Number(overviewData.metrics.uniqueCustomers).toLocaleString()}
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-amber-100">
          Unique Customers
        </div>
      </div>
    </div>
  );
};
