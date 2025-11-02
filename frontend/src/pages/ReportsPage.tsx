import React, { useEffect, useState } from "react";
import { reportsAPI } from "../services";
import {
  DailySalesReport,
  EmployeePerformanceReport,
  ProductPerformanceReport,
  InventoryReport,
} from "../types";
import { formatDate } from "../utils/reportUtils";
import { RefreshButton } from "../components/common";
import { DateRangeFilter } from "../components/reports/DateRangeFilter";
import { DailySalesCard } from "../components/reports/DailySalesCard";
import { SalesRangeCard } from "../components/reports/SalesRangeCard";
import { EmployeePerformanceCard } from "../components/reports/EmployeePerformanceCard";
import { ProductPerformanceCard } from "../components/reports/ProductPerformanceCard";
import { InventorySummaryCard } from "../components/reports/InventorySummaryCard";

const ReportsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [daily, setDaily] = useState<DailySalesReport | null>(null);
  const [range, setRange] = useState<{ start: string; end: string }>({
    start: formatDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)),
    end: formatDate(new Date()),
  });
  const [salesRange, setSalesRange] = useState<any>(null);
  const [employeePerf, setEmployeePerf] =
    useState<EmployeePerformanceReport | null>(null);
  const [productPerf, setProductPerf] =
    useState<ProductPerformanceReport | null>(null);
  const [inventory, setInventory] = useState<InventoryReport | null>(null);

  const fetchReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [d, r, emp, prod, inv] = await Promise.all([
        reportsAPI.getDailySales(range.end),
        reportsAPI.getSalesRange(range.start, range.end),
        reportsAPI.getEmployeePerformance(range.start, range.end),
        reportsAPI.getProductPerformance(range.start, range.end, 5),
        reportsAPI.getInventory(),
      ]);
      setDaily(d);
      setSalesRange(r);
      setEmployeePerf(emp);
      setProductPerf(prod);
      setInventory(inv);
    } catch (e: any) {
      setError(e?.message || "Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, [range.start, range.end]);

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
          <div className="flex min-h-40 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="mb-6 rounded bg-red-100 p-4 text-red-700">
            {error}
          </div>
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
