import { useQuery } from "@tanstack/react-query";
import { analyticsAPI } from "../api/analyticsAPI";
import type { Period } from "../../types/analyticsTypes";

// Query Keys
export const analyticsKeys = {
  all: ["analytics"] as const,
  overview: (params?: any) => [...analyticsKeys.all, "overview", params] as const,
  salesTrend: (params?: any) => [...analyticsKeys.all, "salesTrend", params] as const,
  topProducts: (params?: any) => [...analyticsKeys.all, "topProducts", params] as const,
  categoryBreakdown: (params?: any) => [...analyticsKeys.all, "categoryBreakdown", params] as const,
  customerStats: (params?: any) => [...analyticsKeys.all, "customerStats", params] as const,
  paymentMethods: (params?: any) => [...analyticsKeys.all, "paymentMethods", params] as const,
  profitMargin: (params?: any) => [...analyticsKeys.all, "profitMargin", params] as const,
  stockTurnover: (params?: any) => [...analyticsKeys.all, "stockTurnover", params] as const,
  salesTrends: (params?: any) => [...analyticsKeys.all, "salesTrends", params] as const,
  customerAnalytics: (params?: any) => [...analyticsKeys.all, "customerAnalytics", params] as const,
};

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get analytics overview
 */
export const useAnalyticsOverview = (params?: {
  startDate?: string;
  endDate?: string;
  period?: Period;
}) => {
  // Convert period to date params if not custom
  const queryParams =
    params?.period === "custom" && params?.startDate && params?.endDate
      ? { startDate: params.startDate, endDate: params.endDate }
      : { period: params?.period || "today" };

  return useQuery({
    queryKey: analyticsKeys.overview(queryParams),
    queryFn: () => analyticsAPI.getOverview(queryParams),
  });
};

/**
 * Get sales trend data
 */
export const useSalesTrend = (params?: { period?: Period; groupBy?: string }) => {
  return useQuery({
    queryKey: analyticsKeys.salesTrend(params),
    queryFn: () => analyticsAPI.getSalesTrend(params),
  });
};

/**
 * Get top products
 */
export const useTopProducts = (params?: {
  startDate?: string;
  endDate?: string;
  period?: Period;
  limit?: number;
}) => {
  const queryParams =
    params?.period === "custom" && params?.startDate && params?.endDate
      ? { startDate: params.startDate, endDate: params.endDate, limit: params.limit }
      : { period: params?.period || "today", limit: params?.limit || 10 };

  return useQuery({
    queryKey: analyticsKeys.topProducts(queryParams),
    queryFn: () => analyticsAPI.getTopProducts(queryParams),
  });
};

/**
 * Get category breakdown
 */
export const useCategoryBreakdown = (params?: {
  startDate?: string;
  endDate?: string;
  period?: Period;
}) => {
  const queryParams =
    params?.period === "custom" && params?.startDate && params?.endDate
      ? { startDate: params.startDate, endDate: params.endDate }
      : { period: params?.period || "today" };

  return useQuery({
    queryKey: analyticsKeys.categoryBreakdown(queryParams),
    queryFn: () => analyticsAPI.getCategoryBreakdown(queryParams),
  });
};

/**
 * Get customer statistics
 */
export const useCustomerStats = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: analyticsKeys.customerStats(params),
    queryFn: () => analyticsAPI.getCustomerStats(params),
  });
};

/**
 * Get payment methods breakdown
 */
export const usePaymentMethods = (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: analyticsKeys.paymentMethods(params),
    queryFn: () => analyticsAPI.getPaymentMethods(params),
  });
};

/**
 * Get profit margin report
 */
export const useProfitMargin = (params?: {
  startDate?: string;
  endDate?: string;
  categoryId?: number;
}) => {
  return useQuery({
    queryKey: analyticsKeys.profitMargin(params),
    queryFn: () => analyticsAPI.getProfitMargin(params),
  });
};

/**
 * Get stock turnover report
 */
export const useStockTurnover = (params?: { days?: number; categoryId?: number }) => {
  return useQuery({
    queryKey: analyticsKeys.stockTurnover(params),
    queryFn: () => analyticsAPI.getStockTurnover(params),
  });
};

/**
 * Get sales trends report
 */
export const useSalesTrends = (params?: {
  period?: "daily" | "weekly" | "monthly";
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: analyticsKeys.salesTrends(params),
    queryFn: () => analyticsAPI.getSalesTrends(params),
  });
};

/**
 * Get customer analytics report
 */
export const useCustomerAnalytics = (params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}) => {
  return useQuery({
    queryKey: analyticsKeys.customerAnalytics(params),
    queryFn: () => analyticsAPI.getCustomerAnalytics(params),
  });
};
