import React, { useMemo, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import {
  useCashDrawers,
  useCustomerAnalyticsReport,
  useDailySalesReport,
  useEmployeePerformanceReport,
  useInventoryReport,
  useProductPerformanceReport,
  useProfitAnalysisReport,
  useSalesRangeReport,
  useSalesTrendsReport,
  useStockTurnoverReport,
} from "../services/queries";
import { formatCurrency } from "../utils/currencyUtils";
import { downloadCSV } from "../utils/exportUtils";
import { formatDate } from "../utils/reportUtils";

type Tab = "overview" | "sales" | "products" | "staff" | "inventory" | "turnover" | "customers" | "profit" | "shift";

import { ZReportModal } from '../components/reports/ZReportModal';
import { CustomersTab } from '../components/reports/tabs/CustomersTab';
import { InventoryTab } from '../components/reports/tabs/InventoryTab';
import { OverviewTab } from '../components/reports/tabs/OverviewTab';
import { ProductsTab } from '../components/reports/tabs/ProductsTab';
import { ProfitTab } from '../components/reports/tabs/ProfitTab';
import { SalesTab } from '../components/reports/tabs/SalesTab';
import { ShiftTab } from '../components/reports/tabs/ShiftTab';
import { StaffTab } from '../components/reports/tabs/StaffTab';
import { TurnoverTab } from '../components/reports/tabs/TurnoverTab';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];


export default function ReportsPage() {
  const { settings } = useSettings();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);
  const [activePreset, setActivePreset] = useState<number | null>(30);
  const [salesViewMode, setSalesViewMode] = useState<"transactions" | "daily">("transactions");

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

  // Compute prior period dates for comparison
  const priorPeriod = useMemo(() => {
    const startMs = new Date(dateRange.start).getTime();
    const endMs = new Date(dateRange.end).getTime();
    const durationMs = endMs - startMs;
    const priorEnd = new Date(startMs - 24 * 60 * 60 * 1000); // day before current start
    const priorStart = new Date(priorEnd.getTime() - durationMs);
    return {
      start: formatDate(priorStart),
      end: formatDate(priorEnd)
    };
  }, [dateRange]);

  const handleDatePreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setDateRange({ start: formatDate(start), end: formatDate(end) });
    setActivePreset(days);
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
        valA = (a.stock ?? a.stockQuantity ?? 0) * (a.purchasePrice ?? 0);
        valB = (b.stock ?? b.stockQuantity ?? 0) * (b.purchasePrice ?? 0);
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

  // Fetch queries - current period
  const { data: _daily, isLoading: isLoadingDaily, error: errDaily } = useDailySalesReport(dateRange.end);
  const { data: salesRange, isLoading: isLoadingSales, error: errSales } = useSalesRangeReport(dateRange.start, dateRange.end);
  const { data: productPerf, isLoading: isLoadingProducts, error: errProd } = useProductPerformanceReport(dateRange.start, dateRange.end, 50);
  const { data: staffPerf, isLoading: isLoadingStaff, error: errStaff } = useEmployeePerformanceReport(dateRange.start, dateRange.end);
  const { data: inventory, isLoading: isLoadingInv, error: errInv } = useInventoryReport();
  const { data: profitData, isLoading: isLoadingProfit, error: errProfit } = useProfitAnalysisReport(dateRange.start, dateRange.end);

  // Fetch queries - PRIOR period for comparison
  const { data: priorSalesRange } = useSalesRangeReport(priorPeriod.start, priorPeriod.end);
  const { data: priorProfitData } = useProfitAnalysisReport(priorPeriod.start, priorPeriod.end);

  const diffTime = Math.abs(new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime());
  const reportDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const { data: customerData, isLoading: isLoadingCust, error: errCust } = useCustomerAnalyticsReport(reportDays);
  const { data: turnoverData, isLoading: isLoadingTurnover, error: errTurnover } = useStockTurnoverReport(reportDays);
  const { data: trendsData, isLoading: isLoadingTrends, error: errTrends } = useSalesTrendsReport(dateRange.start, dateRange.end);
  const { data: shiftData, isLoading: isLoadingShifts, error: errShifts } = useCashDrawers({ limit: 100 });

  const fmt = (val: number) => formatCurrency(val, settings);
  const isLoading = isLoadingDaily || isLoadingSales || isLoadingProducts || isLoadingStaff || isLoadingInv || isLoadingProfit || isLoadingCust || isLoadingTurnover || isLoadingTrends || isLoadingShifts;
  const anyError = errDaily || errSales || errProd || errStaff || errInv || errProfit || errCust || errTurnover || errTrends || errShifts;

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
            'Unit Cost': p.purchasePrice || 0,
            'In Stock': qty,
            'Stock Value': qty * (p.purchasePrice || 0)
          };
        });
        filename = `inventory_report_${new Date().toLocaleDateString('en-CA')}.csv`;
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
      case "shift":
        dataToExport = (shiftData?.cashDrawers ?? []).map((s: any) => ({
          'Employee Name': s.employee?.name,
          'Opened At': s.openedAt ? new Date(s.openedAt).toLocaleString() : '',
          'Closed At': s.closedAt ? new Date(s.closedAt).toLocaleString() : '',
          'Opening Balance': s.openingBalance,
          'Closing Balance': s.closingBalance,
          'Difference': s.difference,
          'Status': s.status
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

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Business Overview", icon: "📊" },
    { id: "sales", label: "Sales History", icon: "🧾" },
    { id: "products", label: "Product Performance", icon: "📦" },
    { id: "staff", label: "Staff Performance", icon: "👥" },
    { id: "inventory", label: "Inventory Status", icon: "🏪" },
    { id: "turnover", label: "Stock Turnover", icon: "🔄" },
    { id: "customers", label: "Customer Analytics", icon: "🎯" },
    { id: "profit", label: "Profit & Loss", icon: "💰" },
    { id: "shift", label: "Shift / Z-Report", icon: "📋" }
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
  const filteredShifts = (shiftData?.cashDrawers ?? []).filter((s: any) =>
    !term || s.employee?.name?.toLowerCase().includes(term) || s.status?.toLowerCase().includes(term)
  );
  const filteredCustomers = (customerData?.customers ?? []).filter((c: any) =>
    !term || c.name?.toLowerCase().includes(term) || c.loyaltyTier?.toLowerCase().includes(term)
  );
  const filteredProfit = (profitData?.productBreakdown ?? []).filter((p: any) =>
    !term || p.name?.toLowerCase().includes(term)
  );

  // ── Inventory cost warning ──────────────────────────────────────────────────
  const missingCostCount = useMemo(() => {
    return (inventory?.products ?? []).filter((p: any) => !p.purchasePrice || p.purchasePrice === 0).length;
  }, [inventory]);

  // ── Business health calculations ───────────────────────────────────────────
  const businessHealth = useMemo(() => {
    const totalSales = salesRange?.summary?.totalSales ?? 0;
    const totalTransactions = salesRange?.summary?.totalTransactions ?? 0;
    const grossProfit = profitData?.summary?.grossProfit ?? 0;
    const netProfit = profitData?.summary?.netProfit ?? 0;
    const grossMargin = totalSales > 0 ? (grossProfit / totalSales) * 100 : 0;
    const netMargin = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

    // Determine health score
    let status: 'excellent' | 'good' | 'warning' | 'critical' = 'good';
    if (netMargin >= 20) status = 'excellent';
    else if (netMargin >= 10) status = 'good';
    else if (netMargin >= 0) status = 'warning';
    else status = 'critical';

    // Generate insights
    const insights: string[] = [];

    const topProduct = [...(productPerf?.products ?? [])].sort((a: any, b: any) => (b.totalRevenue || 0) - (a.totalRevenue || 0))[0];
    if (topProduct) {
      const topPct = totalSales > 0 ? ((topProduct.totalRevenue / totalSales) * 100).toFixed(0) : 0;
      insights.push(`${topProduct.product?.name} drives ${topPct}% of your revenue.`);
    }

    if (grossMargin > 0) {
      insights.push(`Gross margin is ${grossMargin.toFixed(1)}% — ${grossMargin >= 40 ? 'healthy for retail' : grossMargin >= 25 ? 'moderate, look for cost savings' : 'below average, review supplier pricing'}.`);
    }

    const lowStockCount = (inventory?.products ?? []).filter((p: any) => {
      const qty = p.stock ?? p.stockQuantity ?? 0;
      return qty > 0 && qty <= (p.lowStockThreshold ?? 5);
    }).length;
    const outOfStockCount = (inventory?.products ?? []).filter((p: any) => (p.stock ?? p.stockQuantity ?? 0) <= 0).length;
    if (outOfStockCount > 0) insights.push(`${outOfStockCount} product${outOfStockCount > 1 ? 's' : ''} out of stock — potential lost sales.`);
    else if (lowStockCount > 0) insights.push(`${lowStockCount} product${lowStockCount > 1 ? 's are' : ' is'} running low on stock.`);
    else insights.push(`All products are well-stocked.`);

    return { totalSales, totalTransactions, grossMargin, netMargin, status, insights, grossProfit, netProfit };
  }, [salesRange, profitData, productPerf, inventory]);






  // ── Stock Turnover Donut Data ──────────────────────────────────────────────
  const turnoverDonutData = useMemo(() => {
    const products = turnoverData?.products ?? [];
    const fast = products.filter((p: any) => p.status === 'FAST_MOVING').length;
    const moderate = products.filter((p: any) => p.status === 'MODERATE').length;
    const slow = products.filter((p: any) => p.status === 'SLOW_MOVING').length;
    const stagnant = products.filter((p: any) => p.status === 'STAGNANT').length;
    return [
      { name: 'Fast Moving', value: fast, fill: '#10B981' },
      { name: 'Moderate', value: moderate, fill: '#3B82F6' },
      { name: 'Slow Moving', value: slow, fill: '#F59E0B' },
      { name: 'Stagnant', value: stagnant, fill: '#EF4444' },
    ].filter(d => d.value > 0);
  }, [turnoverData]);

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
              {/* Presets - now with active state */}
              <div className="hidden lg:flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                {[{ label: 'Today', days: 0 }, { label: '7 Days', days: 7 }, { label: '30 Days', days: 30 }].map(preset => (
                  <button
                    key={preset.days}
                    onClick={() => handleDatePreset(preset.days)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activePreset === preset.days
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-white hover:shadow-sm text-gray-700'
                      }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => { setDateRange(r => ({ ...r, start: e.target.value })); setActivePreset(null); }}
                  className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer"
                />
                <span className="text-gray-400 font-bold px-2">→</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => { setDateRange(r => ({ ...r, end: e.target.value })); setActivePreset(null); }}
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
                  className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 shadow-sm flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 print:mt-0 print:p-0 print:max-w-none">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0 print:hidden">
            <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm sticky top-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-3 mt-2">Report Types</h3>
              <nav className="space-y-1">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeTab === t.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <span className="text-lg">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {activeTab !== "overview" && (
              <div className="mb-6 relative max-w-md print:hidden">
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
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all shadow-sm"
                />
              </div>
            )}
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
                    errShifts: errShifts?.message || errShifts,
                  }, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="space-y-6">

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* 1. BUSINESS OVERVIEW                                          */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {activeTab === "overview" && (
                  <OverviewTab
                    businessHealth={businessHealth}
                    fmt={fmt}
                    salesRange={salesRange}
                    priorSalesRange={priorSalesRange}
                    profitData={profitData}
                    priorProfitData={priorProfitData}
                    trendsData={trendsData}
                    productData={productData}
                    paymentData={paymentData}
                    COLORS={COLORS}
                  />
                )}

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* 2. SALES HISTORY                                              */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {activeTab === "sales" && (
                  <SalesTab
                    filteredSales={sortData(filteredSales)}
                    fmt={fmt}
                    salesViewMode={salesViewMode}
                    setSalesViewMode={setSalesViewMode}
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    paginateData={paginateData}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* 3. PRODUCT PERFORMANCE                                        */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {activeTab === "products" && (
                  <ProductsTab
                    filteredProducts={filteredProducts}
                    productData={productData}
                    fmt={fmt}
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    paginateData={paginateData}
                    sortData={sortData}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* 4. STAFF PERFORMANCE                                          */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {activeTab === "staff" && (
                  <StaffTab
                    filteredStaff={filteredStaff}
                    staffData={staffData}
                    fmt={fmt}
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    paginateData={paginateData}
                    sortData={sortData}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* 5. INVENTORY STATUS                                           */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {activeTab === "inventory" && (
                  <InventoryTab
                    filteredInventory={filteredInventory}
                    missingCostCount={missingCostCount}
                    inventory={inventory}
                    fmt={fmt}
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    paginateData={paginateData}
                    sortData={sortData}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* 6. PROFIT & LOSS (with margin %)                              */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {activeTab === "profit" && profitData && (
                  <ProfitTab
                    profitData={profitData}
                    priorProfitData={priorProfitData}
                    filteredProfit={filteredProfit}
                    fmt={fmt}
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    paginateData={paginateData}
                    sortData={sortData}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* 7. STOCK TURNOVER                                             */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {activeTab === "turnover" && turnoverData && (
                  <TurnoverTab
                    filteredTurnover={filteredTurnover}
                    turnoverDonutData={turnoverDonutData}
                    turnoverData={turnoverData}
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    paginateData={paginateData}
                    sortData={sortData}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* 8. CUSTOMER ANALYTICS                                         */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {activeTab === "customers" && customerData && (
                  <CustomersTab
                    filteredCustomers={filteredCustomers}
                    customerData={customerData}
                    fmt={fmt}
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    paginateData={paginateData}
                    sortData={sortData}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                  />
                )}

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* 9. SHIFT / Z-REPORT                                           */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {activeTab === "shift" && (
                  <ShiftTab
                    filteredShifts={filteredShifts}
                    fmt={fmt}
                    sortConfig={sortConfig}
                    handleSort={handleSort}
                    paginateData={paginateData}
                    sortData={sortData}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    setSelectedShiftId={setSelectedShiftId}
                  />
                )}

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Z-Report Modal */}
      {selectedShiftId && (
        <ZReportModal
          shiftId={selectedShiftId}
          onClose={() => setSelectedShiftId(null)}
          settings={settings}
          fmt={fmt}
        />
      )}
    </div>
  );
}
