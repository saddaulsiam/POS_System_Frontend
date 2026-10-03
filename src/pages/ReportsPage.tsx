import React, { useState } from "react";
import {
  useDailySalesReport,
  useSalesRangeReport,
  useEmployeePerformanceReport,
  useProductPerformanceReport,
  useInventoryReport,
  useProfitAnalysisReport,
  useCustomerAnalyticsReport,
  useStockTurnoverReport,
  useSalesTrendsReport,
} from "../services/queries";
import { formatCurrency } from "../utils/currencyUtils";
import { useSettings } from "../context/SettingsContext";
import { formatDate } from "../utils/reportUtils";
import { downloadCSV } from "../utils/exportUtils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

type Tab = "overview" | "sales" | "products" | "staff" | "inventory" | "turnover" | "customers" | "profit";

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function ReportsPage() {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Date filtering state
  const [dateRange, setDateRange] = useState({
    start: formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
    end: formatDate(new Date())
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Reset page when filters/tabs change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, sortConfig]);

  const handleDatePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setDateRange({ start: formatDate(start), end: formatDate(end) });
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortData = (data: any[]) => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      let valA = a;
      let valB = b;
      
      // Handle special derived fields
      if (sortConfig.key === 'stockValue') {
        valA = (a.stock ?? a.stockQuantity ?? 0) * (a.costPrice ?? 0);
        valB = (b.stock ?? b.stockQuantity ?? 0) * (b.costPrice ?? 0);
      } else {
        const keys = sortConfig.key.split('.');
        for (const k of keys) {
          valA = valA?.[k];
          valB = valB?.[k];
        }
      }

      if (valA === valB) return 0;
      if (valA == null) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valB == null) return sortConfig.direction === 'asc' ? 1 : -1;
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortConfig.direction === 'asc' ? (valA < valB ? -1 : 1) : (valA > valB ? -1 : 1);
    });
  };

  const paginateData = (data: any[]) => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  };

  // Fetch queries
  const { data: daily, isLoading: isLoadingDaily, error: errDaily } = useDailySalesReport(dateRange.end);
  const { data: salesRange, isLoading: isLoadingSales, error: errSales } = useSalesRangeReport(dateRange.start, dateRange.end);
  const { data: productPerf, isLoading: isLoadingProducts, error: errProd } = useProductPerformanceReport(dateRange.start, dateRange.end, 50);
  const { data: staffPerf, isLoading: isLoadingStaff, error: errStaff } = useEmployeePerformanceReport(dateRange.start, dateRange.end);
  const { data: inventory, isLoading: isLoadingInv, error: errInv } = useInventoryReport();
  const { data: profitData, isLoading: isLoadingProfit, error: errProfit } = useProfitAnalysisReport(dateRange.start, dateRange.end);

  const diffTime = Math.abs(new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime());
  const reportDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const { data: customerData, isLoading: isLoadingCust, error: errCust } = useCustomerAnalyticsReport(reportDays);
  const { data: turnoverData, isLoading: isLoadingTurnover, error: errTurnover } = useStockTurnoverReport(reportDays);
  const { data: trendsData, isLoading: isLoadingTrends, error: errTrends } = useSalesTrendsReport(dateRange.start, dateRange.end);

  const fmt = (val: number) => formatCurrency(val, settings);
  const isLoading = isLoadingDaily || isLoadingSales || isLoadingProducts || isLoadingStaff || isLoadingInv || isLoadingProfit || isLoadingCust || isLoadingTurnover || isLoadingTrends;
  const anyError = errDaily || errSales || errProd || errStaff || errInv || errProfit || errCust || errTurnover || errTrends;

  // Print function
  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    let dataToExport: any[] = [];
    let filename = `report_${activeTab}_${dateRange.start}_${dateRange.end}.csv`;

    switch (activeTab) {
      case "overview":
        dataToExport = productData.map((p: any) => ({
          'Product Name': p.name,
          'Revenue': p.revenue,
          'Quantity Sold': p.qty
        }));
        filename = `overview_top_products_${dateRange.start}_${dateRange.end}.csv`;
        break;
      case "sales":
        dataToExport = (salesRange?.sales ?? []).map((sale: any) => ({
          'Receipt No': sale.receiptId,
          'Date': new Date(sale.createdAt).toLocaleString(),
          'Customer': sale.customer?.name || 'Walk-in',
          'Payment Method': sale.paymentMethod,
          'Amount': sale.finalAmount
        }));
        break;
      case "products":
        dataToExport = (productPerf?.products ?? []).map((p: any) => ({
          'Product Name': p.product?.name,
          'Quantity Sold': p.totalQuantitySold,
          'Revenue': p.totalRevenue,
          'Est. Profit': p.estimatedProfit
        }));
        break;
      case "staff":
        dataToExport = (staffPerf?.performance ?? []).map((emp: any) => ({
          'Employee Name': emp.employee?.name,
          'Role': emp.employee?.role,
          'Transactions': emp.totalTransactions,
          'Total Sales': emp.totalSales,
          'Avg Sale': emp.averageTransaction
        }));
        break;
      case "inventory":
        dataToExport = (inventory?.products ?? []).map((p: any) => {
          const qty = p.stock ?? p.stockQuantity ?? 0;
          return {
            'Product Name': p.name,
            'SKU': p.sku || p.barcode || '',
            'Unit Cost': p.costPrice || 0,
            'In Stock': qty,
            'Stock Value': qty * (p.costPrice || 0)
          };
        });
        filename = `inventory_report_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case "turnover":
        dataToExport = (turnoverData?.products ?? []).map((p: any) => ({
          'Product Name': p.name,
          'Category': p.category || '',
          'Current Stock': p.currentStock,
          'Sold In Period': p.soldInPeriod,
          'Turnover Rate': p.turnoverRate,
          'Status': p.status
        }));
        break;
      case "customers":
        dataToExport = (customerData?.customers ?? []).map((c: any) => ({
          'Customer Name': c.name,
          'Loyalty Tier': c.loyaltyTier || 'Standard',
          'Purchases': c.purchaseCount,
          'Avg Order Value': c.averageOrderValue,
          'Total Spent': c.totalSpent
        }));
        break;
      case "profit":
        dataToExport = (profitData?.productBreakdown ?? []).map((p: any) => ({
          'Product': p.name,
          'Units Sold': p.unitsSold,
          'Revenue': p.revenue,
          'COGS': p.cogs,
          'Gross Profit': p.grossProfit
        }));
        break;
    }

    if (dataToExport.length > 0) {
      downloadCSV(dataToExport, filename);
    } else {
      alert("No data available to export.");
    }
  };

  // Helper mappings
  const paymentData = (salesRange?.salesByPaymentMethod ?? []).map((pm: any) => ({
    name: pm.paymentMethod,
    value: pm._sum?.finalAmount ?? 0,
    count: pm._count?.id ?? 0,
  }));

  const productData = (productPerf?.products ?? []).slice(0, 10).map((p: any) => ({
    name: p.product?.name?.substring(0, 15) + (p.product?.name?.length > 15 ? '...' : ''),
    revenue: p.totalRevenue,
    qty: p.totalQuantitySold
  }));

  const staffData = (staffPerf?.performance ?? []).map((e: any) => ({
    name: e.employee?.name?.split(' ')[0],
    sales: e.totalSales,
    transactions: e.totalTransactions
  }));

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Business Overview" },
    { id: "sales", label: "Sales History" },
    { id: "products", label: "Product Performance" },
    { id: "staff", label: "Staff Performance" },
    { id: "inventory", label: "Inventory Status" },
    { id: "turnover", label: "Stock Turnover" },
    { id: "customers", label: "Customer Analytics" },
    { id: "profit", label: "Profit & Loss" }
  ];

  // Filtering Logic
  const term = searchTerm.toLowerCase();
  const filteredSales = (salesRange?.sales ?? []).filter((s: any) => 
    !term || s.receiptId?.toLowerCase().includes(term) || s.customer?.name?.toLowerCase().includes(term) || s.paymentMethod?.toLowerCase().includes(term)
  );
  const filteredProducts = (productPerf?.products ?? []).filter((p: any) => 
    !term || p.product?.name?.toLowerCase().includes(term)
  );
  const filteredStaff = (staffPerf?.performance ?? []).filter((s: any) => 
    !term || s.employee?.name?.toLowerCase().includes(term) || s.employee?.role?.toLowerCase().includes(term)
  );
  const filteredInventory = (inventory?.products ?? []).filter((p: any) => 
    !term || p.name?.toLowerCase().includes(term) || p.sku?.toLowerCase().includes(term) || p.barcode?.toLowerCase().includes(term)
  );
  const filteredTurnover = (turnoverData?.products ?? []).filter((p: any) => 
    !term || p.name?.toLowerCase().includes(term) || p.category?.toLowerCase().includes(term)
  );
  const filteredCustomers = (customerData?.customers ?? []).filter((c: any) => 
    !term || c.name?.toLowerCase().includes(term) || c.loyaltyTier?.toLowerCase().includes(term)
  );
  const filteredProfit = (profitData?.productBreakdown ?? []).filter((p: any) => 
    !term || p.name?.toLowerCase().includes(term)
  );

  const SortableHeader = ({ label, sortKey, align = 'left' }: { label: string, sortKey: string, align?: 'left' | 'right' | 'center' }) => (
    <th 
      onClick={() => handleSort(sortKey)}
      className={`px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none`}
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
        {label}
        {sortConfig?.key === sortKey ? (
          <span className="text-blue-600 font-bold ml-1">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
        ) : (
          <span className="text-gray-300 ml-1 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">↕</span>
        )}
      </div>
    </th>
  );

  const PaginationControls = ({ totalItems }: { totalItems: number }) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) return null;
    
    return (
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white print:hidden">
        <span className="text-sm text-gray-500">
          Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100 font-medium text-gray-700 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 hover:bg-gray-100 font-medium text-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12 print:bg-white print:pb-0">
      {/* Top Navigation & Header */}
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reports</h1>
              <p className="text-sm text-gray-500 mt-1">Monitor your store's performance and analytics.</p>
            </div>

            <div className="flex flex-col xl:flex-row items-center gap-3">
              {/* Presets */}
              <div className="hidden lg:flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                <button onClick={() => handleDatePreset(0)} className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-white hover:shadow-sm text-gray-700 transition-all">Today</button>
                <button onClick={() => handleDatePreset(7)} className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-white hover:shadow-sm text-gray-700 transition-all">7 Days</button>
                <button onClick={() => handleDatePreset(30)} className="px-3 py-1.5 text-xs font-medium rounded-md hover:bg-white hover:shadow-sm text-gray-700 transition-all">30 Days</button>
              </div>

              <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(r => ({ ...r, start: e.target.value }))}
                  className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer"
                />
                <span className="text-gray-400 font-bold px-2">→</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(r => ({ ...r, end: e.target.value }))}
                  className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-100 shadow-sm flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto gap-6 border-b border-transparent">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`py-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${activeTab === t.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 print:hidden">
        {activeTab !== "overview" && (
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search in this report..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
            />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 print:mt-0 print:p-0 print:max-w-none">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : anyError ? (
          <div className="bg-red-50 p-6 rounded-xl border border-red-200">
            <h3 className="text-red-800 font-bold text-lg mb-2">Error Loading Report Data</h3>
            <pre className="text-sm text-red-600 whitespace-pre-wrap">
              {JSON.stringify({
                errDaily: errDaily?.message || errDaily,
                errSales: errSales?.message || errSales,
                errProd: errProd?.message || errProd,
                errStaff: errStaff?.message || errStaff,
                errInv: errInv?.message || errInv,
                errProfit: errProfit?.message || errProfit,
                errCust: errCust?.message || errCust,
                errTurnover: errTurnover?.message || errTurnover,
                errTrends: errTrends?.message || errTrends,
              }, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="space-y-6">

            {/* 1. BUSINESS OVERVIEW */}
            {activeTab === "overview" && (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Gross Sales</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{fmt(salesRange?.summary?.totalSales ?? 0)}</p>
                    <p className="text-sm text-gray-500 mt-1">For selected period</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Transactions</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{salesRange?.summary?.totalTransactions ?? 0}</p>
                    <p className="text-sm text-gray-500 mt-1">Receipts generated</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Avg Order Value</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {fmt(salesRange?.summary?.totalTransactions ? ((salesRange?.summary?.totalSales ?? 0) / salesRange.summary.totalTransactions) : 0)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Per transaction</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Tax</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{fmt(salesRange?.summary?.totalTax ?? 0)}</p>
                    <p className="text-sm text-gray-500 mt-1">Collected tax</p>
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
            )}

            {/* 2. SALES HISTORY */}
            {activeTab === "sales" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-lg font-bold text-gray-900">Transaction History</h3>
                  <span className="text-sm text-gray-500">{salesRange?.sales?.length || 0} records</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="group">
                        <SortableHeader label="Receipt No." sortKey="receiptId" />
                        <SortableHeader label="Date & Time" sortKey="createdAt" />
                        <SortableHeader label="Customer" sortKey="customer.name" />
                        <SortableHeader label="Payment Method" sortKey="paymentMethod" />
                        <SortableHeader label="Amount" sortKey="finalAmount" align="right" />
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginateData(sortData(filteredSales)).map((sale: any) => (
                        <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{sale.receiptId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sale.createdAt).toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sale.customer?.name || 'Walk-in Customer'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {sale.paymentMethod || 'Unknown'}
                            </span>
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
                  <PaginationControls totalItems={filteredSales.length} />
                </div>
              </div>
            )}

            {/* 3. PRODUCT PERFORMANCE */}
            {activeTab === "products" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                  <h3 className="text-lg font-bold text-gray-900">Product Sales Report</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="group">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                        <SortableHeader label="Product Name" sortKey="product.name" />
                        <SortableHeader label="Quantity Sold" sortKey="totalQuantitySold" align="right" />
                        <SortableHeader label="Gross Revenue" sortKey="totalRevenue" align="right" />
                        <SortableHeader label="Est. Profit" sortKey="estimatedProfit" align="right" />
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
                            No product sales found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <PaginationControls totalItems={filteredProducts.length} />
                </div>
              </div>
            )}

            {/* 4. STAFF PERFORMANCE */}
            {activeTab === "staff" && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                  <h3 className="text-lg font-bold text-gray-900">Employee Sales Performance</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="group">
                        <SortableHeader label="Employee" sortKey="employee.name" />
                        <SortableHeader label="Role" sortKey="employee.role" />
                        <SortableHeader label="Transactions" sortKey="totalTransactions" align="right" />
                        <SortableHeader label="Total Sales" sortKey="totalSales" align="right" />
                        <SortableHeader label="Avg. Sale" sortKey="averageTransaction" align="right" />
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
                  <PaginationControls totalItems={filteredStaff.length} />
                </div>
              </div>
            )}

            {/* 5. INVENTORY STATUS */}
            {activeTab === "inventory" && (
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
                        <SortableHeader label="Product Name" sortKey="name" />
                        <SortableHeader label="SKU / Barcode" sortKey="sku" />
                        <SortableHeader label="Unit Cost" sortKey="costPrice" align="right" />
                        <SortableHeader label="In Stock" sortKey="stock" align="right" />
                        <SortableHeader label="Stock Value" sortKey="stockValue" align="right" />
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginateData(sortData(filteredInventory)).map((p: any, i: number) => {
                        const qty = p.stock ?? p.stockQuantity ?? 0;
                        const isOut = qty <= 0;
                        const isLow = !isOut && qty <= (p.lowStockThreshold ?? 5);
                        return (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">{p.sku || p.barcode || '—'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{fmt(p.costPrice || 0)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">{qty}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">{fmt(qty * (p.costPrice || 0))}</td>
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
                  <PaginationControls totalItems={filteredInventory.length} />
                </div>
              </div>
            )}

            {/* 6. PROFIT ANALYSIS */}
            {activeTab === "profit" && profitData && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Profit & Loss Statement</h3>
                    <p className="text-sm text-gray-500">For the period {profitData.period.startDate} to {profitData.period.endDate}</p>
                  </div>
                  <div className="p-6">
                    <div className="max-w-3xl mx-auto space-y-4">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Gross Revenue</span>
                        <span className="font-semibold">{fmt(profitData.summary.grossRevenue)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Discounts</span>
                        <span className="text-red-500">-{fmt(profitData.summary.totalDiscounts)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Refunds / Returns</span>
                        <span className="text-red-500">-{fmt(profitData.summary.totalRefunds)}</span>
                      </div>
                      <div className="flex justify-between py-3 bg-gray-50 px-4 rounded-lg font-bold text-gray-900">
                        <span>Net Revenue</span>
                        <span>{fmt(profitData.summary.netRevenue)}</span>
                      </div>

                      <div className="flex justify-between py-2 border-b border-gray-100 mt-6">
                        <span className="text-gray-600">Cost of Goods Sold (COGS)</span>
                        <span className="text-red-500">-{fmt(profitData.summary.cogs)}</span>
                      </div>
                      <div className="flex justify-between py-3 bg-blue-50 px-4 rounded-lg font-bold text-blue-900">
                        <span>Gross Profit</span>
                        <span>{fmt(profitData.summary.grossProfit)}</span>
                      </div>

                      <div className="flex justify-between py-2 border-b border-gray-100 mt-6">
                        <span className="text-gray-600">Operating Expenses</span>
                        <span className="text-red-500">-{fmt(profitData.summary.operatingExpenses)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Est. Payment Processing Fees</span>
                        <span className="text-red-500">-{fmt(profitData.summary.paymentFees)}</span>
                      </div>
                      <div className="flex justify-between py-4 bg-green-50 px-4 rounded-lg font-black text-green-800 text-lg">
                        <span>Net Profit</span>
                        <span>{fmt(profitData.summary.netProfit)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Product-Wise Profit Breakdown</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr className="group">
                          <SortableHeader label="Product" sortKey="name" />
                          <SortableHeader label="Units Sold" sortKey="unitsSold" align="right" />
                          <SortableHeader label="Revenue" sortKey="revenue" align="right" />
                          <SortableHeader label="COGS" sortKey="cogs" align="right" />
                          <SortableHeader label="Gross Profit" sortKey="grossProfit" align="right" />
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginateData(sortData(filteredProfit)).map((p: any, i: number) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{p.unitsSold}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{fmt(p.revenue)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 text-right">{fmt(p.cogs)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 text-right">{fmt(p.grossProfit)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <PaginationControls totalItems={filteredProfit.length} />
                  </div>
                </div>
              </div>
            )}

            {/* 7. STOCK TURNOVER */}
            {activeTab === "turnover" && turnoverData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Stock Turnover Analysis</h3>
                  <div className="text-sm">
                    <span className="text-gray-500">Period: </span>
                    <span className="font-bold text-gray-900">{turnoverData.period.days} Days</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="group">
                        <SortableHeader label="Product Name" sortKey="name" />
                        <SortableHeader label="Category" sortKey="category" />
                        <SortableHeader label="Current Stock" sortKey="currentStock" align="right" />
                        <SortableHeader label="Sold In Period" sortKey="soldInPeriod" align="right" />
                        <SortableHeader label="Turnover Rate" sortKey="turnoverRate" align="right" />
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
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
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
                  <PaginationControls totalItems={filteredTurnover.length} />
                </div>
              </div>
            )}

            {/* 8. CUSTOMER ANALYTICS */}
            {activeTab === "customers" && customerData && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">Top Customers</h3>
                  <div className="text-sm">
                    <span className="text-gray-500">Active Customers: </span>
                    <span className="font-bold text-gray-900">{customerData.summary.totalActiveCustomers}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="group">
                        <SortableHeader label="Customer Name" sortKey="name" />
                        <SortableHeader label="Loyalty Tier" sortKey="loyaltyTier" />
                        <SortableHeader label="Purchases" sortKey="purchaseCount" align="right" />
                        <SortableHeader label="Avg Order Value" sortKey="averageOrderValue" align="right" />
                        <SortableHeader label="Total Spent" sortKey="totalSpent" align="right" />
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
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
                  <PaginationControls totalItems={filteredCustomers.length} />
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
