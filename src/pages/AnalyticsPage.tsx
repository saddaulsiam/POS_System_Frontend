import React from "react";
import { AnalyticsOverviewCards } from "../components/analytics/AnalyticsOverviewCards";
import { AnalyticsPageSkeleton } from "../components/analytics/AnalyticsPageSkeleton";
import { AnalyticsPeriodSelector } from "../components/analytics/AnalyticsPeriodSelector";
import { CategoryBreakdownChart } from "../components/analytics/CategoryBreakdownChart";
import { SalesTrendChart } from "../components/analytics/SalesTrendChart";
import { TopProductsTable } from "../components/analytics/TopProductsTable";
import { RefreshButton } from "../components/common";
import { useSettings } from "../context/SettingsContext";
import { useAnalyticsData } from "../hooks/useAnalyticsData";

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
          <>
            {/* Business Health Banner */}
            <div className={`mb-6 rounded-xl border p-5 ${overviewData.growth.revenue >= 0 ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${overviewData.growth.revenue >= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {overviewData.growth.revenue >= 0 ? '🚀' : '⚠️'}
                  </div>
                  <div>
                    <h3 className={`font-bold ${overviewData.growth.revenue >= 0 ? 'text-emerald-800' : 'text-amber-800'}`}>
                      {overviewData.growth.revenue >= 0 ? 'Revenue is Growing' : 'Revenue is Declining'}
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Your revenue has {overviewData.growth.revenue >= 0 ? 'increased' : 'decreased'} by <span className="font-semibold text-slate-900">{Math.abs(overviewData.growth.revenue).toFixed(1)}%</span> compared to the previous period.
                    </p>
                  </div>
                </div>
                {topProducts && topProducts.length > 0 && (
                  <div className="flex gap-2">
                    <div className="bg-white/60 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600">
                      💡 {topProducts[0]?.name || 'Top Product'} is your best seller
                    </div>
                  </div>
                )}
              </div>
            </div>

            <AnalyticsOverviewCards
              overviewData={overviewData}
              settings={settings}
            />
          </>
        )}

        {/* Charts Row */}
        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Sales Trend Chart */}
          <SalesTrendChart salesTrend={salesTrend} settings={settings} />

          {/* Category Breakdown */}
          <CategoryBreakdownChart
            categories={categories}
            settings={settings}
            colors={COLORS}
          />
        </div>

        {/* Top Products */}
        <TopProductsTable topProducts={topProducts} settings={settings} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
