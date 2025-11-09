import React from "react";
import { AnalyticsOverviewCards } from "../components/analytics/AnalyticsOverviewCards";
import { AnalyticsPeriodSelector } from "../components/analytics/AnalyticsPeriodSelector";
import { CategoryBreakdownChart } from "../components/analytics/CategoryBreakdownChart";
import { SalesTrendChart } from "../components/analytics/SalesTrendChart";
import { TopProductsTable } from "../components/analytics/TopProductsTable";
import { RefreshButton } from "../components/common";
import { useSettings } from "../context/SettingsContext";
import { useAnalyticsData } from "../hooks/useAnalyticsData";
import { formatCurrency } from "../utils/currencyUtils";
import { AnalyticsPageSkeleton } from "../components/analytics/AnalyticsPageSkeleton";

const AnalyticsPage: React.FC = () => {
  const { settings } = useSettings();
  const {
    period,
    setPeriod,
    loading,
    refreshing,
    overviewData,
    salesTrend,
    topProducts,
    categories,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    fetchAnalytics,
  } = useAnalyticsData();

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
  ];

  const getPeriodLabel = () => {
    switch (period) {
      case "today":
        return "Today";
      case "yesterday":
        return "Yesterday";
      case "week":
        return "This Week";
      case "lastWeek":
        return "Last Week";
      case "month":
        return "This Month";
      case "lastMonth":
        return "Last Month";
      case "custom":
        return customStartDate && customEndDate
          ? `${customStartDate} to ${customEndDate}`
          : "Custom Range";
      default:
        return "Today";
    }
  };

  if (loading) {
    return <AnalyticsPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Sales Analytics
            </h1>
            <p className="mt-1 text-gray-600">{getPeriodLabel()}</p>
          </div>
          <div className="mt-4 flex items-center gap-3 md:mt-0">
            <RefreshButton onClick={fetchAnalytics} loading={refreshing} />
          </div>
        </div>

        {/* Period Selector */}
        <AnalyticsPeriodSelector
          period={period}
          setPeriod={setPeriod}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
          onApply={fetchAnalytics}
          loading={loading || refreshing}
        />

        {/* Overview Cards */}
        {overviewData && (
          <AnalyticsOverviewCards
            overviewData={overviewData}
            settings={settings}
          />
        )}

        {/* Charts Row */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Sales Trend Chart */}
          <SalesTrendChart
            salesTrend={salesTrend}
            settings={settings}
            formatCurrency={formatCurrency}
          />

          {/* Category Breakdown */}
          <CategoryBreakdownChart
            categories={categories}
            settings={settings}
            formatCurrency={formatCurrency}
            colors={COLORS}
          />
        </div>

        {/* Top Products */}
        <TopProductsTable
          topProducts={topProducts}
          settings={settings}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
