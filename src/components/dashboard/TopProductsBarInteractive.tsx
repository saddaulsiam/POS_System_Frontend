import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

interface TopProduct {
  id: number | string;
  name: string;
  totalSold: number;
  revenue: number;
}

interface TopProductsBarInteractiveProps {
  data: TopProduct[];
}

const BAR_COLORS = [
  "#6366F1", // Indigo
  "#4F46E5",
  "#4338CA",
  "#3730A3",
  "#312E81",
];

export const TopProductsBarInteractive: React.FC<TopProductsBarInteractiveProps> = ({ data }) => {
  const { settings } = useSettings();
  const currencySymbol = settings?.currencySymbol || "$";
  const [metric, setMetric] = useState<"units" | "revenue">("units");

  // Handle case with no data
  if (!data || data.length === 0) {
    return (
      <div className="flex h-80 flex-col items-center justify-center text-slate-400">
        <span className="text-4xl mb-2">📦</span>
        <p className="text-sm font-medium">No sales data available for products</p>
      </div>
    );
  }

  // Sort data based on selected metric
  const sortedData = [...data]
    .sort((a, b) => (metric === "units" ? b.totalSold - a.totalSold : b.revenue - a.revenue))
    .slice(0, 5); // Limit to top 5 for neatness

  // Truncate name for YAxis label
  const formatYAxisTick = (name: string) => {
    if (!name) return "";
    return name.length > 15 ? `${name.substring(0, 15)}...` : name;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col justify-between">
      {/* Header and Toggle */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Top Selling Products</h3>
          <p className="mt-1 text-sm text-gray-500 font-medium">Your highest performing inventory items</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-center">
          <button
            onClick={() => setMetric("units")}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
              metric === "units"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Units Sold
          </button>
          <button
            onClick={() => setMetric("revenue")}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
              metric === "revenue"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Revenue
          </button>
        </div>
      </div>

      {/* Chart and Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center my-4">
        {/* Horizontal Bar Chart */}
        <div className="lg:col-span-2 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  if (metric === "revenue") {
                    if (val >= 1000) return `${currencySymbol}${(val / 1000).toFixed(0)}k`;
                    return `${currencySymbol}${val}`;
                  }
                  return val.toLocaleString();
                }}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                fontWeight="600"
                tickLine={false}
                axisLine={false}
                tickFormatter={formatYAxisTick}
                width={95}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc", radius: 8 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as TopProduct;
                    return (
                      <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-lg">
                        <p className="text-xs font-bold text-slate-800 mb-2">{item.name}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between gap-4 text-xs">
                            <span className="text-slate-400 font-medium">Units Sold:</span>
                            <span className="font-extrabold text-slate-700">{item.totalSold.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between gap-4 text-xs">
                            <span className="text-slate-400 font-medium">Revenue:</span>
                            <span className="font-extrabold text-slate-700">{formatCurrency(item.revenue, settings)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey={metric === "units" ? "totalSold" : "revenue"}
                radius={[0, 6, 6, 0]}
                barSize={16}
              >
                {sortedData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_COLORS[index % BAR_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Product Mini Rank List */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rank Details</p>
          {sortedData.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-extrabold text-slate-600">
                #{index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-700 truncate">{item.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">
                  {metric === "units"
                    ? `${item.totalSold.toLocaleString()} units sold`
                    : `${formatCurrency(item.revenue, settings)} revenue`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
