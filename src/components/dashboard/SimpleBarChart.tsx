import React from "react";

interface SimpleBarChartProps {
  data: Array<{ label: string; value: number }>;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-20 truncate text-sm text-gray-600">
            {item.label}
          </div>
          <div className="relative h-4 flex-1 rounded-full bg-gray-200">
            <div
              className="h-4 rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <div className="w-16 text-right text-sm font-medium">
            {item.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};
