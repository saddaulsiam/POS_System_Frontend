import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SummaryWidget } from "../../common";
import { SortableHeader, PaginationControls, InsightCallout } from "../ReportsCommon";

export interface CustomersTabProps {
  filteredCustomers: any[];
  customerData: any;
  fmt: (val: number) => string;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  handleSort: (key: string) => void;
  paginateData: (data: any[]) => any[];
  sortData: (data: any[]) => any[];
  pageSize: number;
  currentPage: number;
  setCurrentPage: (updater: number | ((prev: number) => number)) => void;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({
  filteredCustomers, customerData, fmt, sortConfig, handleSort,
  paginateData, sortData, pageSize, currentPage, setCurrentPage
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryWidget title="Active Customers" value={filteredCustomers.length} subtitle="In current filter" variant="blue" icon="👤" />
        <SummaryWidget title="Avg Customer Spend" value={fmt(filteredCustomers.reduce((sum: number, c: any) => sum + (c.totalSpent || 0), 0) / (filteredCustomers.length || 1))} subtitle="Average total spent" variant="green" icon="💳" />
        <SummaryWidget title="Avg Order Value" value={fmt(filteredCustomers.length > 0 ? filteredCustomers.reduce((sum: number, c: any) => sum + (c.averageOrderValue || 0), 0) / filteredCustomers.length : 0)} subtitle="Across these customers" variant="default" icon="📊" />
      </div>

      {/* ── Customer Value Chart ───────────────────────────────── */}
      {filteredCustomers.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Customers by Spend</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {(() => {
              const sorted = [...filteredCustomers].sort((a: any, b: any) => (b.totalSpent || 0) - (a.totalSpent || 0));
              const top = sorted[0];
              return top ? <InsightCallout icon="👑" label="Top customer" value={`${top.name} — ${fmt(top.totalSpent)} (${top.purchaseCount} purchases)`} color="blue" /> : null;
            })()}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[...filteredCustomers].sort((a: any, b: any) => (b.totalSpent || 0) - (a.totalSpent || 0)).slice(0, 10).map((c: any) => ({
                  name: c.name?.split(' ')[0] || 'Unknown',
                  totalSpent: c.totalSpent || 0,
                  purchases: c.purchaseCount || 0,
                }))}
                margin={{ left: -20, right: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number, name: string) => [name === 'totalSpent' ? fmt(value) : value, name === 'totalSpent' ? 'Total Spent' : 'Purchases']}
                />
                <Bar dataKey="totalSpent" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={32} name="Total Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Top Customers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="group">
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Customer Name" sortKey="name" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Loyalty Tier" sortKey="loyaltyTier" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Purchases" sortKey="purchaseCount" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Avg Order Value" sortKey="averageOrderValue" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Total Spent" sortKey="totalSpent" align="right" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginateData(sortData(filteredCustomers)).map((c: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                      {c.name?.charAt(0)?.toUpperCase()}
                    </div>
                    {c.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.loyaltyTier === 'Gold' ? 'bg-amber-100 text-amber-800' :
                      c.loyaltyTier === 'Silver' ? 'bg-gray-200 text-gray-700' :
                        c.loyaltyTier === 'Platinum' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {c.loyaltyTier || 'Standard'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{c.purchaseCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{fmt(c.averageOrderValue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600 text-right">{fmt(c.totalSpent)}</td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <PaginationControls pageSize={pageSize} currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={filteredCustomers.length} />
        </div>
      </div>
    </div>
  );
};
