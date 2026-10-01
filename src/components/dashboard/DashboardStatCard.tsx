import React from "react";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  change?: { value: number; isPositive: boolean };
  icon: string;
  color?: string;
}

const colorMap: Record<string, { bg: string; text: string; badgeBg: string; badgeText: string; border: string }> = {
  green: {
    bg: "bg-emerald-50/70",
    text: "text-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    border: "border-emerald-100",
  },
  blue: {
    bg: "bg-blue-50/70",
    text: "text-blue-600",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    border: "border-blue-100",
  },
  yellow: {
    bg: "bg-amber-50/70",
    text: "text-amber-600",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    border: "border-amber-100",
  },
  purple: {
    bg: "bg-purple-50/70",
    text: "text-purple-600",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    border: "border-purple-100",
  },
  indigo: {
    bg: "bg-indigo-50/70",
    text: "text-indigo-600",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-700",
    border: "border-indigo-100",
  },
  pink: {
    bg: "bg-pink-50/70",
    text: "text-pink-600",
    badgeBg: "bg-pink-50",
    badgeText: "text-pink-700",
    border: "border-pink-100",
  },
  gray: {
    bg: "bg-slate-100/70",
    text: "text-slate-600",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    border: "border-slate-200",
  },
};

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  change,
  icon,
  color = "blue",
}) => {
  const styles = colorMap[color] || colorMap.blue;

  return (
    <div className="group rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className="text-3xl font-extrabold tracking-tight text-slate-800">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold ${
                  change.isPositive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {change.isPositive ? "↑" : "↓"} {Math.abs(change.value)}%
              </span>
              <span className="text-xs font-medium text-slate-400">vs last period</span>
            </div>
          )}
        </div>
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110 border ${styles.bg} ${styles.text} ${styles.border}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

