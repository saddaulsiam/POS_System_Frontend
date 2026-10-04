import React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SummaryWidget } from "../../common";

export interface OverviewTabProps {
  businessHealth: any;
  fmt: (val: number) => string;
  salesRange: any;
  priorSalesRange: any;
  profitData: any;
  priorProfitData: any;
  trendsData: any;
  productData: any[];
  paymentData: any[];
  COLORS: string[];
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  businessHealth, fmt, salesRange, priorSalesRange, profitData, priorProfitData, trendsData, productData, paymentData, COLORS
}) => {
  return (
    <>
      {/* ── Business Health Banner ─────────────────────────────── */}
      <div className={`rounded-xl border p-5 ${businessHealth.status === 'excellent' ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200' :
        businessHealth.status === 'good' ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200' :
          businessHealth.status === 'warning' ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200' :
            'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
        }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-sm ${businessHealth.status === 'excellent' ? 'bg-emerald-500 text-white' :
              businessHealth.status === 'good' ? 'bg-blue-500 text-white' :
                businessHealth.status === 'warning' ? 'bg-amber-500 text-white' :
                  'bg-red-500 text-white'
              }`}>
              {businessHealth.status === 'excellent' ? '🚀' : businessHealth.status === 'good' ? '✅' : businessHealth.status === 'warning' ? '⚡' : '🔴'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {businessHealth.status === 'excellent' ? 'Excellent Performance' :
                  businessHealth.status === 'good' ? 'Business Performing Well' :
                    businessHealth.status === 'warning' ? 'Needs Attention' : 'Critical — Take Action'}
              </h2>
              <p className="text-sm text-gray-600">
                Net margin: <strong>{businessHealth.netMargin.toFixed(1)}%</strong> · Gross margin: <strong>{businessHealth.grossMargin.toFixed(1)}%</strong> · {businessHealth.totalTransactions} transactions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Net Profit</p>
              <p className={`text-2xl font-extrabold ${businessHealth.netProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>{fmt(businessHealth.netProfit)}</p>
            </div>
          </div>
        </div>
        {/* AI Insights */}
        {businessHealth.insights.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200/60 flex flex-wrap gap-2">
            {businessHealth.insights.map((insight: any, i: number) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-xs bg-white/70 px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 font-medium">
                <span className="text-yellow-500">💡</span> {insight}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Summary Cards - Color Coded with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryWidget
          title="Gross Sales"
          value={fmt(salesRange?.summary?.totalSales ?? 0)}
          subtitle="For selected period"
          variant="green"
          icon="💰"
          trend={{ current: salesRange?.summary?.totalSales ?? 0, previous: priorSalesRange?.summary?.totalSales ?? 0 }}
        />
        <SummaryWidget
          title="Transactions"
          value={salesRange?.summary?.totalTransactions ?? 0}
          subtitle="Receipts generated"
          variant="blue"
          icon="🧾"
          trend={{ current: salesRange?.summary?.totalTransactions ?? 0, previous: priorSalesRange?.summary?.totalTransactions ?? 0 }}
        />
        <SummaryWidget
          title="Avg Order Value"
          value={fmt(salesRange?.summary?.totalTransactions ? ((salesRange?.summary?.totalSales ?? 0) / salesRange.summary.totalTransactions) : 0)}
          subtitle="Per transaction"
          variant="blue"
          icon="📊"
          trend={{
            current: salesRange?.summary?.totalTransactions ? (salesRange.summary.totalSales / salesRange.summary.totalTransactions) : 0,
            previous: priorSalesRange?.summary?.totalTransactions ? (priorSalesRange.summary.totalSales / priorSalesRange.summary.totalTransactions) : 0,
          }}
        />
        <SummaryWidget
          title="Total Tax"
          value={fmt(salesRange?.summary?.totalTax ?? 0)}
          subtitle="Collected tax"
          variant="default"
          icon="🏛️"
        />
        <SummaryWidget
          title="Total Discounts"
          value={`-${fmt(profitData?.summary?.totalDiscounts ?? 0)}`}
          variant="red"
          icon="🏷️"
          trend={{ current: profitData?.summary?.totalDiscounts ?? 0, previous: priorProfitData?.summary?.totalDiscounts ?? 0 }}
        />
        <SummaryWidget
          title="Refunds / Returns"
          value={`-${fmt(profitData?.summary?.totalRefunds ?? 0)}`}
          variant="red"
          icon="↩️"
        />
        <SummaryWidget
          title="Operating Exp."
          value={`-${fmt(profitData?.summary?.operatingExpenses ?? 0)}`}
          variant="red"
          icon="📋"
        />
        <SummaryWidget
          title="Net Profit"
          value={fmt(profitData?.summary?.netProfit ?? 0)}
          subtitle="After expenses"
          variant={(profitData?.summary?.netProfit ?? 0) >= 0 ? "green" : "red"}
          icon="💵"
          trend={{ current: profitData?.summary?.netProfit ?? 0, previous: priorProfitData?.summary?.netProfit ?? 0 }}
        />
      </div>

      {/* Sales Trend Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Daily Sales Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendsData?.data || []} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={(val) => {
                  try { return new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }
                  catch (e) { return val; }
                }}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `$${val}`} />
              <Tooltip
                cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '5 5' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [fmt(value), 'Revenue']}
                labelFormatter={(label) => {
                  try { return new Date(label).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }); }
                  catch (e) { return label; }
                }}
              />
              <Area type="monotone" dataKey="totalRevenue" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Products by Revenue</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData} margin={{ left: -20, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [fmt(value), 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Sales by Payment Method</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {paymentData.map((_: any, index: number) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value: number) => fmt(value)} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};
