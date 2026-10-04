import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TrendBadge } from "../../common";
import { SortableHeader, PaginationControls, InsightCallout } from "../ReportsCommon";

export interface ProfitTabProps {
  profitData: any;
  priorProfitData: any;
  filteredProfit: any[];
  fmt: (val: number) => string;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  handleSort: (key: string) => void;
  paginateData: (data: any[]) => any[];
  sortData: (data: any[]) => any[];
  pageSize: number;
  currentPage: number;
  setCurrentPage: (updater: number | ((prev: number) => number)) => void;
}

export const ProfitTab: React.FC<ProfitTabProps> = ({
  profitData, priorProfitData, filteredProfit, fmt, sortConfig, handleSort,
  paginateData, sortData, pageSize, currentPage, setCurrentPage
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Comprehensive Financial Summary</h3>
          <p className="text-sm text-gray-500">For the period {profitData.period.startDate} to {profitData.period.endDate}</p>
        </div>
        <div className="p-6">
          {/* ── Waterfall P&L Chart ─────────────────────── */}
          <div className="mb-8">
            <h4 className="text-md font-bold text-gray-800 mb-4">Profit & Loss Flow</h4>
            <div className="h-72 w-full bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              {(() => {
                const raw = [
                  { name: 'Gross Rev', val: profitData.summary.grossRevenue, isTotal: true, color: '#3B82F6' },
                  { name: 'Discounts', val: -(profitData.summary.totalDiscounts || 0) },
                  { name: 'Refunds', val: -(profitData.summary.totalRefunds || 0) },
                  { name: 'Net Rev', val: profitData.summary.netRevenue, isTotal: true, color: '#0EA5E9' },
                  { name: 'COGS', val: -(profitData.summary.cogs || 0) },
                  { name: 'Gross Profit', val: profitData.summary.grossProfit, isTotal: true, color: '#10B981' },
                  { name: 'Op Exps', val: -(profitData.summary.operatingExpenses || 0) },
                  { name: 'Fees', val: -(profitData.summary.paymentFees || 0) },
                  { name: 'Net Profit', val: profitData.summary.netProfit, isTotal: true, color: profitData.summary.netProfit >= 0 ? '#059669' : '#EF4444' }
                ];
                let curr = 0;
                const wfData = raw.map(item => {
                  if (item.isTotal) {
                    curr = item.val;
                    return { name: item.name, total: item.val, fill: item.color };
                  }
                  const prev = curr;
                  curr += item.val;
                  return {
                    name: item.name,
                    transparent: Math.min(prev, curr),
                    decrease: item.val < 0 ? Math.abs(item.val) : 0,
                    increase: item.val > 0 ? item.val : 0,
                  };
                });

                return (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={wfData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} />
                      <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} tick={{ fontSize: 11, fill: '#6B7280' }} />
                      <Tooltip
                        cursor={{ fill: '#F3F4F6' }}
                        content={({ active, payload, label }: any) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            let val = 0;
                            let title = 'Amount';
                            if (data.total !== undefined) { val = data.total; title = 'Total'; }
                            else if (data.decrease) { val = -data.decrease; title = 'Decrease'; }
                            else if (data.increase) { val = data.increase; title = 'Increase'; }
                            return (
                              <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-lg text-sm">
                                <p className="font-bold text-gray-700 mb-1">{label}</p>
                                <p className="text-gray-600">{title}: <span className="font-semibold text-gray-900">{fmt(val)}</span></p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="transparent" stackId="a" fill="transparent" />
                      <Bar dataKey="decrease" stackId="a" fill="#EF4444" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="increase" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="total" stackId="a" radius={[4, 4, 0, 0]}>
                        {wfData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill || '#cbd5e1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                );
              })()}
            </div>
          </div>

          {/* ── Detailed Financial Grid ─────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-xs font-bold text-gray-500 uppercase">Gross Revenue</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{fmt(profitData.summary.grossRevenue)}</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50">
              <p className="text-xs font-bold text-red-600 uppercase">Discounts</p>
              <p className="text-xl font-bold text-red-500 mt-1">-{fmt(profitData.summary.totalDiscounts)}</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50">
              <p className="text-xs font-bold text-red-600 uppercase">Refunds / Returns</p>
              <p className="text-xl font-bold text-red-500 mt-1">-{fmt(profitData.summary.totalRefunds)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-xs font-bold text-blue-800 uppercase">Net Revenue</p>
              <p className="text-xl font-bold text-blue-900 mt-1">{fmt(profitData.summary.netRevenue)}</p>
            </div>

            <div className="p-4 rounded-lg bg-red-50">
              <p className="text-xs font-bold text-red-600 uppercase">Cost of Goods (COGS)</p>
              <p className="text-xl font-bold text-red-500 mt-1">-{fmt(profitData.summary.cogs)}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <p className="text-xs font-bold text-emerald-800 uppercase">Gross Profit</p>
              <p className="text-xl font-bold text-emerald-900 mt-1">{fmt(profitData.summary.grossProfit)}</p>
              <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                {profitData.summary.grossRevenue > 0 ? `${((profitData.summary.grossProfit / profitData.summary.grossRevenue) * 100).toFixed(1)}% margin` : '—'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-red-50">
              <p className="text-xs font-bold text-red-600 uppercase">Operating Expenses</p>
              <p className="text-xl font-bold text-red-500 mt-1">-{fmt(profitData.summary.operatingExpenses)}</p>
            </div>
            <div className="p-4 rounded-lg bg-red-50">
              <p className="text-xs font-bold text-red-600 uppercase">Est. Payment Fees</p>
              <p className="text-xl font-bold text-red-500 mt-1">-{fmt(profitData.summary.paymentFees)}</p>
            </div>
          </div>

          {/* ── Net Profit Summary Bar ──────────────────────── */}
          <div className={`mt-6 pt-6 border-t flex flex-col sm:flex-row justify-between items-center p-5 rounded-xl shadow-inner ${profitData.summary.netProfit >= 0
            ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-100'
            : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-100'
            }`}>
            <div>
              <span className="text-lg font-bold text-gray-700">Net Profit (Estimated)</span>
              <p className="text-xs text-gray-500 mt-0.5">
                {profitData.summary.grossRevenue > 0
                  ? `Net margin: ${((profitData.summary.netProfit / profitData.summary.grossRevenue) * 100).toFixed(1)}%`
                  : ''
                }
              </p>
            </div>
            <div className="text-right mt-2 sm:mt-0">
              <span className={`text-3xl font-black ${profitData.summary.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {fmt(profitData.summary.netProfit)}
              </span>
              {priorProfitData?.summary && (
                <div className="mt-1">
                  <TrendBadge current={profitData.summary.netProfit} previous={priorProfitData.summary.netProfit} fmt={fmt} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Profit Breakdown Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Product-Wise Profit Breakdown</h3>
        </div>
        {/* Top/Bottom callouts */}
        {filteredProfit.length > 0 && (
          <div className="px-6 py-3 border-b border-gray-100 flex flex-wrap gap-2 bg-gray-50/30">
            {(() => {
              const sorted = [...filteredProfit].sort((a: any, b: any) => (b.grossProfit || 0) - (a.grossProfit || 0));
              const top = sorted[0];
              const bottom = sorted[sorted.length - 1];
              return (
                <>
                  {top && <InsightCallout icon="🏆" label="Highest profit" value={`${top.name} — ${fmt(top.grossProfit)}`} color="green" />}
                  {bottom && sorted.length > 1 && <InsightCallout icon="⚠️" label="Lowest profit" value={`${bottom.name} — ${fmt(bottom.grossProfit)}`} color="amber" />}
                </>
              );
            })()}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="group">
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Product" sortKey="name" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Units Sold" sortKey="unitsSold" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Revenue" sortKey="revenue" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="COGS" sortKey="cogs" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Gross Profit" sortKey="grossProfit" align="right" />
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Margin %</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginateData(sortData(filteredProfit)).map((p: any, i: number) => {
                const margin = p.revenue > 0 ? (p.grossProfit / p.revenue) * 100 : 0;
                const isHighMargin = margin >= 50;
                const isLowMargin = margin < 20 && margin >= 0;
                return (
                  <tr key={i} className={`hover:bg-gray-50 transition-colors ${isLowMargin ? 'bg-amber-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{p.unitsSold}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{fmt(p.revenue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 text-right">{fmt(p.cogs)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">{fmt(p.grossProfit)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${isHighMargin ? 'bg-emerald-100 text-emerald-800' :
                        isLowMargin ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {margin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <PaginationControls pageSize={pageSize} currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={filteredProfit.length} />
        </div>
      </div>
    </div>
  );
};
