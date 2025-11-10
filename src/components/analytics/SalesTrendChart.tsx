import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
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
}) => (
  <div className="rounded-lg bg-white p-6 shadow-sm">
    <h2 className="mb-4 text-xl font-bold text-gray-800">Sales Trend</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={salesTrend}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis />
        <Tooltip
          formatter={(value: number) => formatCurrency(value, settings)}
          labelStyle={{ color: "#374151" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#3B82F6"
          strokeWidth={2}
          name="Revenue"
          dot={{ fill: "#3B82F6", r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#10B981"
          strokeWidth={2}
          name="Transactions"
          dot={{ fill: "#10B981", r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
