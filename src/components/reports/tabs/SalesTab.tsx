import React from 'react';
import { SummaryWidget } from "../../common";
import { SortableHeader, PaginationControls, PaymentBadge } from "../ReportsCommon";
import { formatDate } from "../../../utils/reportUtils";

export interface SalesTabProps {
  filteredSales: any[];
  fmt: (val: number) => string;
  salesViewMode: 'transactions' | 'daily';
  setSalesViewMode: (mode: 'transactions' | 'daily') => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  handleSort: (key: string) => void;
  paginateData: (data: any[]) => any[];
  pageSize: number;
  currentPage: number;
  setCurrentPage: (updater: number | ((prev: number) => number)) => void;
}

export const SalesTab: React.FC<SalesTabProps> = ({
  filteredSales, fmt, salesViewMode, setSalesViewMode, sortConfig, handleSort,
  paginateData, pageSize, currentPage, setCurrentPage
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryWidget title="Total Transactions" value={filteredSales.length} subtitle="Based on current filter" variant="blue" icon="🧾" />
        <SummaryWidget title="Total Revenue" value={fmt(filteredSales.reduce((sum: number, sale: any) => sum + (sale.finalAmount || 0), 0))} subtitle="From filtered sales" variant="green" icon="💰" />
        <SummaryWidget title="Average Sale" value={fmt(filteredSales.length > 0 ? (filteredSales.reduce((sum: number, sale: any) => sum + (sale.finalAmount || 0), 0) / filteredSales.length) : 0)} subtitle="Per transaction" variant="default" icon="📊" />
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
            <span className="text-sm text-gray-500">{filteredSales.length} records</span>
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex bg-gray-200 p-1 rounded-lg">
            <button
              onClick={() => setSalesViewMode('transactions')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${salesViewMode === 'transactions' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Transactions
            </button>
            <button
              onClick={() => setSalesViewMode('daily')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${salesViewMode === 'daily' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Daily Summary
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {salesViewMode === 'transactions' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="group">
                  <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Receipt No." sortKey="receiptId" />
                  <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Date & Time" sortKey="createdAt" />
                  <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Customer" sortKey="customer.name" />
                  <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Payment Method" sortKey="paymentMethod" />
                  <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Amount" sortKey="finalAmount" align="right" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginateData(filteredSales).map((sale: any) => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{sale.receiptId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sale.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.customer?.name || 'Walk-in Customer'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <PaymentBadge method={sale.paymentMethod} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">{fmt(sale.finalAmount)}</td>
                  </tr>
                ))}
                {filteredSales.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                      No sales transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="group">
                  <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Date" sortKey="date" />
                  <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Transactions" sortKey="count" align="right" />
                  <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Revenue" sortKey="total" align="right" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(() => {
                  const dailyData: Record<string, { count: number, total: number }> = {};
                  filteredSales.forEach((s: any) => {
                    const date = formatDate(new Date(s.createdAt));
                    if (!dailyData[date]) dailyData[date] = { count: 0, total: 0 };
                    dailyData[date].count += 1;
                    dailyData[date].total += (s.finalAmount || 0);
                  });

                  let aggArray = Object.entries(dailyData).map(([date, data]) => ({ date, ...data }));

                  // Simple sort support for aggregated view
                  if (sortConfig) {
                    aggArray.sort((a: any, b: any) => {
                      let valA = a[sortConfig.key] || 0;
                      let valB = b[sortConfig.key] || 0;
                      if (sortConfig.key === 'date') {
                        valA = new Date(a.date).getTime();
                        valB = new Date(b.date).getTime();
                      }
                      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                      return 0;
                    });
                  } else {
                    // Default sort by date desc
                    aggArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                  }

                  if (aggArray.length === 0) {
                    return (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500">
                          No sales data available.
                        </td>
                      </tr>
                    );
                  }

                  return paginateData(aggArray).map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(row.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{row.count}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">{fmt(row.total)}</td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          )}
          <PaginationControls
            pageSize={pageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={
              salesViewMode === 'transactions'
                ? filteredSales.length
                : new Set(filteredSales.map((s: any) => formatDate(new Date(s.createdAt)))).size
            }
          />
        </div>
      </div>
    </div>
  );
};
