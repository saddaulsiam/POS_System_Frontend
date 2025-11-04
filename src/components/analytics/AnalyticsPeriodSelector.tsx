import React from "react";
import { Period } from "../../types/analyticsTypes";

interface AnalyticsPeriodSelectorProps {
  period: Period;
  setPeriod: (period: Period) => void;
  customStartDate: string;
  setCustomStartDate: (date: string) => void;
  customEndDate: string;
  setCustomEndDate: (date: string) => void;
  onApply: () => void;
  loading?: boolean;
}

const PERIODS: { value: Period; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "This Week" },
  { value: "lastWeek", label: "Last Week" },
  { value: "month", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "custom", label: "Custom" },
];

export const AnalyticsPeriodSelector: React.FC<
  AnalyticsPeriodSelectorProps
> = ({
  period,
  setPeriod,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  onApply,
  loading,
}) => {
  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            className={`rounded-lg border px-4 py-2 font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              period === p.value
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:bg-blue-50"
            }`}
            onClick={() => setPeriod(p.value)}
            disabled={loading}
          >
            {p.label}
          </button>
        ))}
      </div>
      {period === "custom" && (
        <div className="flex flex-col items-end gap-4 md:flex-row">
          <div className="min-w-[150px] flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <div className="min-w-[150px] flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
          </div>
          <button
            onClick={onApply}
            className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600"
            disabled={loading}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};
