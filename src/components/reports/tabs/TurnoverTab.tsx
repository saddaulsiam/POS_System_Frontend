import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { SummaryWidget } from "../../common";
import { SortableHeader, PaginationControls } from "../ReportsCommon";

export interface TurnoverTabProps {
  filteredTurnover: any[];
  turnoverDonutData: any[];
  turnoverData: any;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  handleSort: (key: string) => void;
  paginateData: (data: any[]) => any[];
  sortData: (data: any[]) => any[];
  pageSize: number;
  currentPage: number;
  setCurrentPage: (updater: number | ((prev: number) => number)) => void;
}

export const TurnoverTab: React.FC<TurnoverTabProps> = ({
  filteredTurnover, turnoverDonutData, turnoverData, sortConfig, handleSort,
  paginateData, sortData, pageSize, currentPage, setCurrentPage
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryWidget title="Fast Moving" value={filteredTurnover.filter((p: any) => p.status === 'FAST_MOVING').length} subtitle="High turnover rate" variant="green" icon="🚀" />
        <SummaryWidget title="Stagnant" value={filteredTurnover.filter((p: any) => p.status === 'STAGNANT').length} subtitle="Zero or very low sales" variant="red" icon="🛑" />
        <SummaryWidget title="Analysis Period" value={`${turnoverData.period.days} Days`} subtitle="Date range" variant="default" icon="📅" />
      </div>

      {/* ── Turnover Distribution Chart ────────────────────────── */}
      {turnoverDonutData.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Turnover Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={turnoverDonutData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {turnoverDonutData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} products`, '']} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {turnoverDonutData.map(d => (
                <div key={d.name} className="p-3 rounded-lg border bg-gray-50">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.fill }} />
                    <span className="text-xs font-semibold text-gray-600">{d.name}</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{d.value}</p>
                  <p className="text-xs text-gray-500">
                    {filteredTurnover.length > 0 ? `${((d.value / filteredTurnover.length) * 100).toFixed(0)}%` : '0%'} of total
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Stock Turnover Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="group">
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Product Name" sortKey="name" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Category" sortKey="category" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Current Stock" sortKey="currentStock" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Sold In Period" sortKey="soldInPeriod" align="right" />
                <SortableHeader sortConfig={sortConfig} handleSort={handleSort} label="Turnover Rate" sortKey="turnoverRate" align="right" />
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginateData(sortData(filteredTurnover)).map((p: any, i: number) => {
                let statusColor = "bg-gray-100 text-gray-800";
                if (p.status === "FAST_MOVING") statusColor = "bg-green-100 text-green-800";
                else if (p.status === "MODERATE") statusColor = "bg-blue-100 text-blue-800";
                else if (p.status === "SLOW_MOVING") statusColor = "bg-yellow-100 text-yellow-800";
                else if (p.status === "STAGNANT") statusColor = "bg-red-100 text-red-800";

                return (
                  <tr key={i} className={`hover:bg-gray-50 transition-colors ${p.status === 'STAGNANT' ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.category || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">{p.currentStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{p.soldInPeriod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700 text-right">{p.turnoverRate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                        {p.status.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <PaginationControls pageSize={pageSize} currentPage={currentPage} setCurrentPage={setCurrentPage} totalItems={filteredTurnover.length} />
        </div>
      </div>
    </div>
  );
};
