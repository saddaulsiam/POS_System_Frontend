import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SummaryWidget } from "../../common";
import { SortableHeader, PaginationControls } from "../ReportsCommon";

export interface StaffTabProps {
  filteredStaff: any[];
  staffData: any[];
  fmt: (val: number) => string;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  handleSort: (key: string) => void;
  paginateData: (data: any[]) => any[];
  sortData: (data: any[]) => any[];
  pageSize: number;
  currentPage: number;
  setCurrentPage: (updater: number | ((prev: number) => number)) => void;
}

export const StaffTab: React.FC<StaffTabProps> = ({
  filteredStaff, staffData, fmt, sortConfig, handleSort,
  paginateData, sortData, pageSize, currentPage, setCurrentPage
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryWidget title="Active Staff" value={filteredStaff.length} subtitle="With sales in period" variant="blue" icon="👥" />
        <SummaryWidget title="Top Performer" value={[...filteredStaff].sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))[0]?.employee?.name || 'N/A'} subtitle="By total sales" variant="amber" icon="🏆" />
        <SummaryWidget title="Total Staff Sales" value={fmt(filteredStaff.reduce((sum: number, s: any) => sum + (s.totalSales || 0), 0))} subtitle="Combined revenue" variant="green" icon="💰" />
      </div>

      {/* ── Staff Performance Chart ────────────────────────────── */}
      {staffData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Staff Sales Comparison</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number, name: string) => [name === 'sales' ? fmt(value) : value, name === 'sales' ? 'Total Sales' : 'Transactions']}
                />
                <Legend iconType="circle" />
                <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} name="Total Sales" />
                <Bar dataKey="transactions" fill="#10B981" radius={[4, 4, 0, 0]} barSize={32} name="Transactions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Employee Sales Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="group">
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Employee" sortKey="employee.name" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Role" sortKey="employee.role" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Transactions" sortKey="totalTransactions" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Total Sales" sortKey="totalSales" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Avg. Sale" sortKey="averageTransaction" align="right" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginateData(sortData(filteredStaff)).map((emp: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {emp.employee?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    {emp.employee?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{emp.employee?.role?.toLowerCase() || 'Staff'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{emp.totalTransactions}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">{fmt(emp.totalSales)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{fmt(emp.averageTransaction)}</td>
                </tr>
              ))}
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    No employee sales data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <PaginationControls pageSize={pageSize} currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={filteredStaff.length} />
        </div>
      </div>
    </div>
  );
};
