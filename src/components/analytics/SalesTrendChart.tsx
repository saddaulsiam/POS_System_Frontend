import React from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SalesTrendData } from "../../types/analyticsTypes";
import { formatCurrency } from "../../utils/currencyUtils";

interface SalesTrendChartProps {
  salesTrend: SalesTrendData[];
  settings: any;
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({
  salesTrend,
  settings,
}) => {
  const currencySymbol = settings?.currencySymbol || "$";

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">Sales Trends</h3>
        <p className="text-sm text-slate-400">Monthly, weekly, and daily transaction details</p>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSalesAnalytics" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis 
              dataKey="period" 
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
                  const revenueVal = payload[0].value as number;
                  const orderVal = payload[0].payload.count as number;
                  return (
                    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-lg">
                      <p className="text-xs font-bold text-slate-500 mb-2">{label}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4 text-xs">
                          <span className="text-slate-400 font-medium flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            Revenue:
                          </span>
                          <span className="font-extrabold text-slate-700">{formatCurrency(revenueVal, settings)}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-xs">
                          <span className="text-slate-400 font-medium flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Transactions:
                          </span>
                          <span className="font-extrabold text-slate-700">{orderVal.toLocaleString()}</span>
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
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSalesAnalytics)"
              name="Revenue"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
