import { useState, useMemo } from "react";
import {
  useAnalyticsOverview,
  useSalesTrend,
  useTopProducts,
  useCategoryBreakdown,
} from "../services/queries";
import type { Period } from "../types/analyticsTypes";

export function useAnalyticsData() {
  const [period, setPeriod] = useState<Period>("today");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Build query params based on period
  const queryParams = useMemo(() => {
    if (period === "custom" && customStartDate && customEndDate) {
      return { period, startDate: customStartDate, endDate: customEndDate };
    }
    return { period };
  }, [period, customStartDate, customEndDate]);

  // React Query hooks
  const {
    data: overviewData,
    isLoading: overviewLoading,
    refetch: refetchOverview,
  } = useAnalyticsOverview(queryParams);

  const {
    data: salesTrendData,
    isLoading: trendLoading,
    refetch: refetchTrend,
  } = useSalesTrend({
    period,
    groupBy: period === "today" ? "hour" : "day",
  });

  const {
    data: topProductsData,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useTopProducts({ ...queryParams, limit: 10 });

  const {
    data: categoryData,
    isLoading: categoryLoading,
    refetch: refetchCategories,
  } = useCategoryBreakdown(queryParams);

  // Aggregate loading states
  const loading = overviewLoading || trendLoading || productsLoading || categoryLoading;
  const refreshing = false; // React Query handles this automatically

  // Extract data from query results
  const salesTrend = salesTrendData?.data || [];
  const topProducts = topProductsData?.products || [];
  const categories = categoryData?.categories || [];

  // Refresh all queries
  const refresh = () => {
    refetchOverview();
    refetchTrend();
    refetchProducts();
    refetchCategories();
  };

  return {
    period,
    setPeriod,
    loading,
    refreshing,
    overviewData: overviewData || null,
    salesTrend,
    topProducts,
    categories,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    fetchAnalytics: refresh, // Backward compatibility alias
    refresh,
  };
}
