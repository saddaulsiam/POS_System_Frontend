import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CategoryData } from "../../types/analyticsTypes";
import { formatCurrency } from "../../utils/currencyUtils";

interface CategoryBreakdownChartProps {
  categories: CategoryData[];
  settings: any;
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
];

export const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({
  categories,
  settings,
  colors = DEFAULT_COLORS,
}) => (
  <div className="rounded-lg bg-white p-6 shadow-sm">
    <h2 className="mb-4 text-xl font-bold text-gray-800">Sales by Category</h2>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={categories}
          dataKey="revenue"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={(entry: any) =>
            `${entry.name}: ${entry.percentage.toFixed(1)}%`
          }
        >
          {categories.map((_, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatCurrency(value, settings)}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
