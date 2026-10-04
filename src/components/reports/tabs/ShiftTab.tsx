import React from 'react';
import { SummaryWidget } from "../../common";
import { SortableHeader, PaginationControls } from "../ReportsCommon";

export interface ShiftTabProps {
  filteredShifts: any[];
  fmt: (val: number) => string;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  handleSort: (key: string) => void;
  paginateData: (data: any[]) => any[];
  sortData: (data: any[]) => any[];
  pageSize: number;
  currentPage: number;
  setCurrentPage: (updater: number | ((prev: number) => number)) => void;
  setSelectedShiftId: (id: number | null) => void;
}

export const ShiftTab: React.FC<ShiftTabProps> = ({
  filteredShifts, fmt, sortConfig, handleSort,
  paginateData, sortData, pageSize, currentPage, setCurrentPage, setSelectedShiftId
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryWidget title="Total Shifts Recorded" value={filteredShifts.length} subtitle="Based on current filter" variant="blue" icon="📋" />
        <SummaryWidget title="Open Shifts" value={filteredShifts.filter((s: any) => s.status === 'OPEN').length} subtitle="Currently active" variant="green" icon="🟢" />
        <SummaryWidget title="Closed Shifts" value={filteredShifts.filter((s: any) => s.status === 'CLOSED').length} subtitle="Completed registers" variant="default" icon="✅" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Shift / Z-Report History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="group">
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Employee" sortKey="employee.name" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Opened" sortKey="openedAt" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Closed" sortKey="closedAt" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Opening Balance" sortKey="openingBalance" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Closing Balance" sortKey="closingBalance" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Difference" sortKey="difference" align="right" />
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Receipt</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginateData(sortData(filteredShifts)).map((s: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.employee?.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.openedAt ? new Date(s.openedAt).toLocaleString() : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.closedAt ? new Date(s.closedAt).toLocaleString() : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{fmt(s.openingBalance)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{s.closingBalance != null ? fmt(s.closingBalance) : '-'}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-right ${s.difference == null ? 'text-gray-400' : s.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {s.difference != null ? fmt(s.difference) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button onClick={() => setSelectedShiftId(s.id)} className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-lg text-xs font-bold transition-colors">
                      View Z-Report
                    </button>
                  </td>
                </tr>
              ))}
              {filteredShifts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    No shift records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <PaginationControls pageSize={pageSize} currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={filteredShifts.length} />
        </div>
      </div>
    </div>
  );
};
