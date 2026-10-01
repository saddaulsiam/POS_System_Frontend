import React, { useState } from "react";
import { formatDate } from "../utils/reportUtils";
import { RefreshButton } from "../components/common";
import { DateRangeFilter } from "../components/reports/DateRangeFilter";
import { DailySalesCard } from "../components/reports/DailySalesCard";
import { SalesRangeCard } from "../components/reports/SalesRangeCard";
import { EmployeePerformanceCard } from "../components/reports/EmployeePerformanceCard";
import { ProductPerformanceCard } from "../components/reports/ProductPerformanceCard";
import { InventorySummaryCard } from "../components/reports/InventorySummaryCard";
import { ReportsPageSkeleton } from "../components/reports/ReportsPageSkeleton";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/currencyUtils";
import { exportTableToPDF } from "../utils/exportUtils";
import {
  useDailySalesReport,
  useSalesRangeReport,
  useEmployeePerformanceReport,
  useProductPerformanceReport,
  useInventoryReport,
} from "../services/queries";

const ReportsPage: React.FC = () => {
  const { settings } = useSettings();
  const [range, setRange] = useState<{ start: string; end: string }>({
    start: formatDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
    end: formatDate(new Date()),
  });

  // React Query hooks
  const {
    data: daily,
    isLoading: loadingDaily,
    refetch: refetchDaily,
  } = useDailySalesReport(range.end);
  const {
    data: salesRange,
    isLoading: loadingSalesRange,
    refetch: refetchSalesRange,
  } = useSalesRangeReport(range.start, range.end);
  const {
    data: employeePerf,
    isLoading: loadingEmployee,
    refetch: refetchEmployee,
  } = useEmployeePerformanceReport(range.start, range.end);
  const {
    data: productPerf,
    isLoading: loadingProduct,
    refetch: refetchProduct,
  } = useProductPerformanceReport(range.start, range.end, 5);
  const {
    data: inventory,
    isLoading: loadingInventory,
    refetch: refetchInventory,
  } = useInventoryReport();

  const isLoading =
    loadingDaily ||
    loadingSalesRange ||
    loadingEmployee ||
    loadingProduct ||
    loadingInventory;

  const fetchReports = () => {
    refetchDaily();
    refetchSalesRange();
    refetchEmployee();
    refetchProduct();
    refetchInventory();
  };

  // Executive Export All to PDF
  const exportAllToPDF = () => {
    if (daily) {
      exportTableToPDF({
        title: `Daily Sales Report - ${daily.date}`,
        columns: ["Product", "Quantity Sold"],
        data: daily.topProducts.map((p) => [
          p.product?.name || `#${p.productId}`,
          p._sum.quantity,
        ]),
        filename: `daily-sales-${daily.date}.pdf`,
      });
    }

    if (salesRange) {
      exportTableToPDF({
        title: `Sales Range Summary (${range.start} to ${range.end})`,
        columns: ["Total Sales", "Transactions", "Tax", "Discount"],
        data: [
          [
            formatCurrency(salesRange.summary?.totalSales ?? 0, settings),
            salesRange.summary?.totalTransactions ?? 0,
            formatCurrency(salesRange.summary?.totalTax ?? 0, settings),
            formatCurrency(salesRange.summary?.totalDiscount ?? 0, settings),
          ],
        ],
        filename: `sales-range-${range.start}-to-${range.end}.pdf`,
      });
    }

    if (employeePerf) {
      exportTableToPDF({
        title: `Top Staff Performance (${range.start} to ${range.end})`,
        columns: ["Name", "Total Sales", "Transactions", "Avg Transaction"],
        data: employeePerf.performance.map((emp) => [
          emp.employee.name,
          formatCurrency(emp.totalSales, settings),
          emp.totalTransactions,
          formatCurrency(emp.averageTransaction, settings),
        ]),
        filename: `staff-performance-${range.start}-to-${range.end}.pdf`,
      });
    }

    if (productPerf) {
      exportTableToPDF({
        title: `Top Products Sold (${range.start} to ${range.end})`,
        columns: ["Product", "Sold", "Revenue", "Transactions", "Est. Profit"],
        data: productPerf.products.map((prod) => [
          prod.product.name,
          prod.totalQuantitySold,
          formatCurrency(prod.totalRevenue, settings),
          prod.totalTransactions,
          formatCurrency(prod.estimatedProfit, settings),
        ]),
        filename: `top-products-${range.start}-to-${range.end}.pdf`,
      });
    }

    if (inventory) {
      exportTableToPDF({
        title: `Inventory Summary Report`,
        columns: ["Total Products", "Low Stock Alert", "Out of Stock", "Valuation"],
        data: [
          [
            inventory.totalProducts,
            inventory.lowStockCount,
            inventory.outOfStockCount,
            formatCurrency(inventory.totalInventoryValue, settings),
          ],
        ],
        filename: `inventory-summary.pdf`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/15 to-slate-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
              Reports & Analytics
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Generate, print, and export store reports</p>
          </div>
          <div className="flex gap-2.5 self-start sm:self-center">
            <button
              onClick={exportAllToPDF}
              disabled={isLoading}
              className="rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50 px-4 py-2.5 text-xs font-bold text-indigo-600 shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              📥 Export All (PDF)
            </button>
            <RefreshButton onClick={fetchReports} loading={isLoading} />
          </div>
        </div>

        {/* Date Range Filter */}
        <DateRangeFilter
          startDate={range.start}
          endDate={range.end}
          onStartDateChange={(date) => setRange((r) => ({ ...r, start: date }))}
          onEndDateChange={(date) => setRange((r) => ({ ...r, end: date }))}
        />

        {/* Loading State */}
        {isLoading ? (
          <ReportsPageSkeleton />
        ) : (
          <div className="space-y-6">
            {/* Daily Sales Summary */}
            {daily && <DailySalesCard daily={daily} />}

            {/* Sales Range Summary */}
            {salesRange && (
              <SalesRangeCard
                salesRange={salesRange}
                startDate={range.start}
                endDate={range.end}
              />
            )}

            {/* Employee Performance */}
            {employeePerf && (
              <EmployeePerformanceCard
                employeePerf={employeePerf}
                startDate={range.start}
                endDate={range.end}
              />
            )}

            {/* Product Performance */}
            {productPerf && (
              <ProductPerformanceCard
                productPerf={productPerf}
                startDate={range.start}
                endDate={range.end}
              />
            )}

            {/* Inventory Summary */}
            {inventory && <InventorySummaryCard inventory={inventory} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
