import React from 'react';
import { SummaryWidget } from "../../common";
import { SortableHeader, PaginationControls } from "../ReportsCommon";

export interface InventoryTabProps {
  filteredInventory: any[];
  missingCostCount: number;
  inventory: any;
  fmt: (val: number) => string;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  handleSort: (key: string) => void;
  paginateData: (data: any[]) => any[];
  sortData: (data: any[]) => any[];
  pageSize: number;
  currentPage: number;
  setCurrentPage: (updater: number | ((prev: number) => number)) => void;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  filteredInventory, missingCostCount, inventory, fmt, sortConfig, handleSort,
  paginateData, sortData, pageSize, currentPage, setCurrentPage
}) => {
  return (
    <div className="space-y-6">
      {/* ── Cost Price Warning Banner ─────────────────────────── */}
      {missingCostCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-xl mt-0.5">⚠️</span>
          <div>
            <p className="text-sm font-bold text-amber-800">
              {missingCostCount} product{missingCostCount > 1 ? 's have' : ' has'} no cost price set
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Inventory valuation and profit calculations will be inaccurate. Update cost prices in the Products page for accurate reporting.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryWidget title="Total Products" value={filteredInventory.length} subtitle="In catalog" variant="blue" icon="📦" />
        <SummaryWidget title="Low Stock" value={filteredInventory.filter((p: any) => { const qty = p.stock ?? p.stockQuantity ?? 0; return qty > 0 && qty <= (p.lowStockThreshold ?? 5); }).length} subtitle="Needs reordering soon" variant="amber" icon="⚡" />
        <SummaryWidget title="Out of Stock" value={filteredInventory.filter((p: any) => (p.stock ?? p.stockQuantity ?? 0) <= 0).length} subtitle="Currently unavailable" variant="red" icon="🚫" />
      </div>

      {/* ── Inventory Distribution Chart ───────────────────────── */}
      {filteredInventory.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Stock Status Distribution</h3>
          <div className="h-16 flex rounded-lg overflow-hidden border border-gray-200">
            {(() => {
              const total = filteredInventory.length;
              const outOfStock = filteredInventory.filter((p: any) => (p.stock ?? p.stockQuantity ?? 0) <= 0).length;
              const lowStock = filteredInventory.filter((p: any) => { const qty = p.stock ?? p.stockQuantity ?? 0; return qty > 0 && qty <= (p.lowStockThreshold ?? 5); }).length;
              const inStock = total - outOfStock - lowStock;
              return (
                <>
                  {inStock > 0 && (
                    <div className="bg-emerald-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${(inStock / total) * 100}%` }}>
                      {inStock} In Stock
                    </div>
                  )}
                  {lowStock > 0 && (
                    <div className="bg-amber-400 flex items-center justify-center text-amber-900 text-xs font-bold" style={{ width: `${Math.max((lowStock / total) * 100, 8)}%` }}>
                      {lowStock} Low
                    </div>
                  )}
                  {outOfStock > 0 && (
                    <div className="bg-red-500 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${Math.max((outOfStock / total) * 100, 8)}%` }}>
                      {outOfStock} Out
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Current Inventory Valuation</h3>
          <div className="text-sm">
            <span className="text-gray-500">Total Value: </span>
            <span className="font-bold text-gray-900">{fmt(inventory?.totalInventoryValue ?? 0)}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="group">
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Product Name" sortKey="name" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="SKU / Barcode" sortKey="sku" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Unit Cost" sortKey="purchasePrice" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="In Stock" sortKey="stock" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Stock Value" sortKey="stockValue" align="right" />
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginateData(sortData(filteredInventory)).map((p: any, i: number) => {
                const qty = p.stock ?? p.stockQuantity ?? 0;
                const isOut = qty <= 0;
                const isLow = !isOut && qty <= (p.lowStockThreshold ?? 5);
                const hasCost = p.purchasePrice && p.purchasePrice > 0;
                return (
                  <tr key={i} className={`hover:bg-gray-50 transition-colors ${isOut ? 'bg-red-50/30' : isLow ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{p.sku || p.barcode || '—'}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${hasCost ? 'text-gray-600' : 'text-red-400 italic'}`}>
                      {hasCost ? fmt(p.purchasePrice) : 'Not set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">{qty}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">{hasCost ? fmt(qty * p.purchasePrice) : '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {isOut ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Out of Stock</span>
                      ) : isLow ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Low Stock</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">In Stock</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <PaginationControls pageSize={pageSize} currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={filteredInventory.length} />
        </div>
      </div>
    </div>
  );
};
