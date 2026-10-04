import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from "recharts";
import { useSettings } from "../../context/SettingsContext";
import { formatCurrency } from "../../utils/currencyUtils";

const PieComponent = Pie as any;

interface CategoryData {
  category: string;
  sales: number;
  percentage: number;
}

interface CategoryDonutInteractiveProps {
  data: CategoryData[];
}

const COLORS = [
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F59E0B", // Amber
  "#EC4899", // Pink
  "#10B981", // Emerald
  "#0EA5E9", // Sky
  "#8B5CF6", // Violet
  "#F43F5E", // Rose
];

export const CategoryDonutInteractive: React.FC<CategoryDonutInteractiveProps> = ({ data }) => {
  const { settings } = useSettings();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // If there's no data, display placeholder
  if (!data || data.length === 0) {
    return (
      <div className="flex h-80 flex-col items-center justify-center text-slate-400">
        <span className="text-4xl mb-2">🍰</span>
        <p className="text-sm font-medium">No category breakdown available</p>
      </div>
    );
  }

  const totalRevenue = data.reduce((sum, item) => sum + (item.sales || 0), 0);

  // Custom active shape for center detail
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        {/* Render a slightly larger highlight sector on hover */}
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 4}
          outerRadius={outerRadius + 4}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Sales by Category</h3>
        <p className="mt-1 text-sm text-gray-500 font-medium">Proportional category performance</p>
      </div>

      <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Pie Chart with Center text */}
        <div className="relative h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <PieComponent
                activeIndex={activeIndex !== null ? activeIndex : undefined}
                activeShape={renderActiveShape}
                data={data as any}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="sales"
                nameKey="category"
                onMouseEnter={(_: any, index: number) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </PieComponent>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as CategoryData;
                    return (
                      <div className="rounded-xl z-[999] border border-slate-100 bg-white p-2.5 shadow-lg">
                        <p className="text-xs font-bold text-slate-800 mb-1">{item.category}</p>
                        <p className="text-xs text-slate-500 font-medium">
                          Revenue: <span className="font-extrabold text-slate-800">{formatCurrency(item.sales, settings)}</span>
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          Share: <span className="font-extrabold text-slate-800">{item.percentage.toFixed(1)}%</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Centered text in Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</span>
            <span className="text-base font-extrabold text-slate-800 mt-0.5">
              {activeIndex !== null
                ? formatCurrency(data[activeIndex].sales, settings)
                : formatCurrency(totalRevenue, settings)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {activeIndex !== null
                ? `${data[activeIndex].percentage.toFixed(1)}%`
                : "100%"}
            </span>
          </div>
        </div>

        {/* Customized Legend */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {data.slice(0, 6).map((item, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-1.5 rounded-lg transition-colors cursor-pointer ${activeIndex === index ? "bg-slate-50" : "hover:bg-slate-50/50"
                }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs font-semibold text-slate-700 truncate">{item.category}</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-slate-800">
                  {formatCurrency(item.sales, settings)}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
          {data.length > 6 && (
            <div className="text-center text-[10px] font-semibold text-slate-400 mt-2">
              + {data.length - 6} more categories
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
