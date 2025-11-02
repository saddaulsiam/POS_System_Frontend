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
  return (
    <div className="mb-8 flex flex-col space-y-2 md:flex-row md:items-end md:space-x-6 md:space-y-0">
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          className="mt-1 block w-full rounded border border-blue-200 px-3 py-2 focus:ring-2 focus:ring-blue-400"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          max={endDate}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700">
          End Date
        </label>
        <input
          type="date"
          className="mt-1 block w-full rounded border border-blue-200 px-3 py-2 focus:ring-2 focus:ring-blue-400"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          min={startDate}
          max={formatDate(new Date())}
        />
      </div>
    </div>
  );
};
