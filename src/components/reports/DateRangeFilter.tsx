import React from "react";
import { formatDate } from "../../utils/reportUtils";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  // Preset handlers
  const applyPreset = (days: number) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - (days - 1));
    
    onStartDateChange(formatDate(pastDate));
    onEndDateChange(formatDate(today));
  };

  const applyThisMonthPreset = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    onStartDateChange(formatDate(firstDay));
    onEndDateChange(formatDate(today));
  };

  return (
    <div className="mb-8 rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-sm backdrop-blur-md flex flex-col gap-6 md:flex-row md:items-end justify-between">
      {/* Date Pickers */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="min-w-[160px]">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Start Date
          </label>
          <div className="relative">
            <input
              type="date"
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              max={endDate}
            />
          </div>
        </div>
        
        <div className="hidden sm:block text-slate-300 font-bold self-end mb-3">
          →
        </div>

        <div className="min-w-[160px]">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            End Date
          </label>
          <div className="relative">
            <input
              type="date"
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              min={startDate}
              max={formatDate(new Date())}
            />
          </div>
        </div>
      </div>

      {/* Preset Toggles */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Ranges</span>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl self-start">
          <button
            type="button"
            onClick={() => applyPreset(7)}
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:text-slate-900 border border-slate-200/50"
          >
            Last 7 Days
          </button>
          <button
            type="button"
            onClick={() => applyPreset(30)}
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:text-slate-900 border border-slate-200/50"
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={applyThisMonthPreset}
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-all hover:text-slate-900 border border-slate-200/50"
          >
            This Month
          </button>
        </div>
      </div>
    </div>
  );
};
