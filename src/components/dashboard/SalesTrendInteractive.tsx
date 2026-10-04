import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useSalesTrend } from "../../services/queries";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";
import LoadingSpinner from "../common/LoadingSpinner";

type PeriodType = "today" | "week" | "month";

export const SalesTrendInteractive: React.FC = () => {
  const { settings } = useSettings();
  const currencySymbol = settings?.currencySymbol || "$";
  const [period, setPeriod] = useState<PeriodType>("week");

  // Determine groupBy based on selected period
  const groupBy = period === "today" ? "hour" : "day";

  // Fetch sales trend using React Query
  const { data: response, isLoading } = useSalesTrend({ period, groupBy });

  const trendData = response?.data || [];

  // Calculate totals for summary badges
  const totalRevenue = trendData.reduce((sum: number, item: any) => sum + (item.sales || 0), 0);
  const totalTransactions = trendData.reduce((sum: number, item: any) => sum + (item.count || 0), 0);
  const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Format period label for tooltip and header
  const formatXAxis = (tickItem: string) => {
    if (!tickItem) return "";
    if (period === "today") {
      // Input: "YYYY-MM-DD HH:00"
      const parts = tickItem.split(" ");
      return parts.length > 1 ? parts[1] : tickItem;
    }
    // Input: "YYYY-MM-DD"
    try {
      const date = new Date(tickItem);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return tickItem;
    }
  };

  const formatTooltipLabel = (label: string) => {
    if (!label) return "";
    if (period === "today") {
      const parts = label.split(" ");
      return parts.length > 1 ? `Time: ${parts[1]}` : label;
    }
    try {
      return new Date(label).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return label;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header and Filter */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Sales Trend Overview</h3>
          <p className="mt-1 text-sm text-gray-500 font-medium">Track and analyze incoming revenue trends</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-center">
          <button
            onClick={() => setPeriod("today")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${period === "today"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
              }`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod("week")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${period === "week"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
              }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod("month")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${period === "month"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
              }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="mb-6 grid grid-cols-3 gap-4 border-b border-slate-100 pb-6">
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Sales</p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">
            {isLoading ? "..." : formatCurrency(totalRevenue, settings)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Transactions</p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">
            {isLoading ? "..." : totalTransactions.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Avg Order Value</p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">
            {isLoading ? "..." : formatCurrency(avgOrderValue, settings)}
          </p>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-72 w-100 min-w-full">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50">
            <LoadingSpinner size="md" />
          </div>
        ) : trendData.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <span className="text-4xl mb-2">📊</span>
            <p className="text-sm font-medium">No sales data found for this period</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="period"
                tickFormatter={formatXAxis}
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  if (val >= 1000) return `${currencySymbol}${(val / 1000).toFixed(0)}k`;
                  return `${currencySymbol}${val}`;
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const salesVal = payload[0].value as number;
                    const countVal = payload[0].payload.count as number;
                    return (
                      <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-lg">
                        <p className="text-xs font-bold text-slate-500 mb-2">
                          {formatTooltipLabel(String(label || ""))}
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-4 justify-between">
                            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <span className="h-2 w-2 rounded-full bg-indigo-500" />
                              Revenue:
                            </span>
                            <span className="text-xs font-extrabold text-slate-800">
                              {formatCurrency(salesVal, settings)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 justify-between">
                            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              Orders:
                            </span>
                            <span className="text-xs font-extrabold text-slate-800">
                              {countVal}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#6366F1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
