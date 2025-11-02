import { useState, useEffect, useCallback } from "react";
import { analyticsAPI } from "../services";
import toast from "react-hot-toast";
import {
  Period,
  OverviewData,
  SalesTrendData,
  TopProduct,
  CategoryData,
} from "../types/analyticsTypes";

export function useAnalyticsData() {
  const [period, setPeriod] = useState<Period>("today");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [salesTrend, setSalesTrend] = useState<SalesTrendData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const fetchAnalytics = useCallback(async () => {
    try {
      setRefreshing(true);
      const params =
        period === "custom" && customStartDate && customEndDate
          ? { startDate: customStartDate, endDate: customEndDate }
          : { period };
      const [overview, trend, products, categoryBreakdown] = await Promise.all([
        analyticsAPI.getOverview(params),
        analyticsAPI.getSalesTrend({
          period,
          groupBy: period === "today" ? "hour" : "day",
        }),
        analyticsAPI.getTopProducts({ ...params, limit: 10 }),
        analyticsAPI.getCategoryBreakdown(params),
      ]);
      setOverviewData(overview);
      setSalesTrend(trend.data || []);
      setTopProducts(products.products || []);
      setCategories(categoryBreakdown.categories || []);
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      toast.error(error.response?.data?.error || "Failed to load analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period, customStartDate, customEndDate]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
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
  };
}
