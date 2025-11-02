import React from "react";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  change?: { value: number; isPositive: boolean };
  icon: string;
  color?: string;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  change,
  icon,
  color = "blue",
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p
              className={`text-sm ${change.isPositive ? "text-green-600" : "text-red-600"}`}
            >
              {change.isPositive ? "↗" : "↘"} {Math.abs(change.value)}%
            </p>
          )}
        </div>
        <div className={`text-3xl bg-${color}-100 rounded-full p-3`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
