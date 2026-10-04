import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SummaryWidget } from "../../common";
import { SortableHeader, PaginationControls, InsightCallout } from "../ReportsCommon";

export interface ProductsTabProps {
  filteredProducts: any[];
  productData: any[];
  fmt: (val: number) => string;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  handleSort: (key: string) => void;
  paginateData: (data: any[]) => any[];
  sortData: (data: any[]) => any[];
  pageSize: number;
  currentPage: number;
  setCurrentPage: (updater: number | ((prev: number) => number)) => void;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({
  filteredProducts, productData, fmt, sortConfig, handleSort,
  paginateData, sortData, pageSize, currentPage, setCurrentPage
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryWidget title="Unique Products" value={filteredProducts.length} subtitle="In current filter" variant="blue" icon="📦" />
        <SummaryWidget title="Total Items Sold" value={filteredProducts.reduce((sum: number, p: any) => sum + (p.totalQuantitySold || 0), 0)} subtitle="Units moved" variant="green" icon="📈" />
        <SummaryWidget title="Top Product" value={[...filteredProducts].sort((a, b) => (b.totalQuantitySold || 0) - (a.totalQuantitySold || 0))[0]?.product?.name || 'N/A'} subtitle="By quantity sold" variant="amber" icon="🏆" />
      </div>

      {/* ── Product Revenue Chart ──────────────────────────────── */}
      {productData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Product</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {(() => {
              const sorted = [...filteredProducts].sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
              const top = sorted[0];
              const bottom = sorted[sorted.length - 1];
              return (
                <>
                  {top && <InsightCallout icon="🏆" label="Top earner" value={`${top.product?.name} — ${fmt(top.totalRevenue)}`} color="green" />}
                  {bottom && sorted.length > 1 && <InsightCallout icon="📉" label="Lowest" value={`${bottom.product?.name} — ${fmt(bottom.totalRevenue)}`} color="amber" />}
                </>
              );
            })()}
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData} margin={{ left: -20, right: 10 }} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number, name: string) => [fmt(value), name === 'revenue' ? 'Revenue' : 'Qty']}
                />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={36} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Product Sales Report</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="group">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Product Name" sortKey="product.name" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Quantity Sold" sortKey="totalQuantitySold" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Gross Revenue" sortKey="totalRevenue" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Est. Profit" sortKey="estimatedProfit" align="right" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginateData(sortData(filteredProducts)).map((p: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">#{(currentPage - 1) * pageSize + i + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.product?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">{p.totalQuantitySold} units</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">{fmt(p.totalRevenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 text-right">{fmt(p.estimatedProfit)}</td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                    No products found for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <PaginationControls pageSize={pageSize} currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={filteredProducts.length} />
        </div>
      </div>
    </div>
  );
};
