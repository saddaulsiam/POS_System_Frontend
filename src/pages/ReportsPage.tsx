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
import {
  useDailySalesReport,
  useSalesRangeReport,
  useEmployeePerformanceReport,
  useProductPerformanceReport,
  useInventoryReport,
} from "../services/queries";

const ReportsPage: React.FC = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-4xl font-extrabold tracking-tight text-blue-900">
            📊 Reports & Analytics
          </h1>
          <RefreshButton onClick={fetchReports} loading={isLoading} />
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
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
