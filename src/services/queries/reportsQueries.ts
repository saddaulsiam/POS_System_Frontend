import { useQuery } from "@tanstack/react-query";
import { reportsAPI } from "../index";
import { useAuth } from "../../context/AuthContext";

export const reportsQueryKeys = {
  inventory: (storeId?: number | null) => ["reports", "inventory", storeId] as const,
  dailySales: (date?: string, storeId?: number | null) => ["reports", "dailySales", date, storeId] as const,
  salesRange: (startDate?: string, endDate?: string, storeId?: number | null) =>
    ["reports", "salesRange", startDate, endDate, storeId] as const,
  employeePerformance: (startDate?: string, endDate?: string, storeId?: number | null) =>
    ["reports", "employeePerformance", startDate, endDate, storeId] as const,
  productPerformance: (startDate?: string, endDate?: string, limit?: number, storeId?: number | null) =>
    ["reports", "productPerformance", startDate, endDate, limit, storeId] as const,
  profitAnalysis: (startDate?: string, endDate?: string, storeId?: number | null) =>
    ["reports", "profitAnalysis", startDate, endDate, storeId] as const,
  salesTrends: (startDate?: string, endDate?: string, groupBy?: string, storeId?: number | null) =>
    ["reports", "salesTrends", startDate, endDate, groupBy, storeId] as const,
  customerAnalytics: (days?: number, storeId?: number | null) =>
    ["reports", "customerAnalytics", days, storeId] as const,
  stockTurnover: (days?: number, storeId?: number | null) =>
    ["reports", "stockTurnover", days, storeId] as const,
  profitMargin: (startDate?: string, endDate?: string, storeId?: number | null) =>
    ["reports", "profitMargin", startDate, endDate, storeId] as const,
};

export function useInventoryReport() {
  const { user } = useAuth();
  return useQuery({
    queryKey: reportsQueryKeys.inventory(user?.storeId),
    queryFn: () => reportsAPI.getInventory(),
  });
}

export function useDailySalesReport(date?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: reportsQueryKeys.dailySales(date, user?.storeId),
    queryFn: () => reportsAPI.getDailySales(date),
  });
}

export function useSalesRangeReport(startDate?: string, endDate?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: reportsQueryKeys.salesRange(startDate, endDate, user?.storeId),
    queryFn: () =>
      reportsAPI.getSalesRange(startDate as string, endDate as string),
    enabled: !!startDate && !!endDate,
  });
}

export function useEmployeePerformanceReport(
  startDate?: string,
  endDate?: string,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: reportsQueryKeys.employeePerformance(startDate, endDate, user?.storeId),
    queryFn: () => reportsAPI.getEmployeePerformance(startDate, endDate),
  });
}

export function useProductPerformanceReport(
  startDate?: string,
  endDate?: string,
  limit?: number,
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: reportsQueryKeys.productPerformance(startDate, endDate, limit, user?.storeId),
    queryFn: () => reportsAPI.getProductPerformance(startDate, endDate, limit),
  });
}

export function useProfitAnalysisReport(startDate?: string, endDate?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: reportsQueryKeys.profitAnalysis(startDate, endDate, user?.storeId),
    queryFn: () => reportsAPI.getProfitAnalysis(startDate as string, endDate as string),
    enabled: !!startDate && !!endDate,
  });
}

export function useSalesTrendsReport(startDate?: string, endDate?: string, groupBy: string = "day") {
  const { user } = useAuth();
  return useQuery({
    queryKey: reportsQueryKeys.salesTrends(startDate, endDate, groupBy, user?.storeId),
    queryFn: () => reportsAPI.getSalesTrends(startDate as string, endDate as string, groupBy),
    enabled: !!startDate && !!endDate,
  });
}

export function useCustomerAnalyticsReport(days: number = 30) {
  const { user } = useAuth();
  return useQuery({
    queryKey: reportsQueryKeys.customerAnalytics(days, user?.storeId),
    queryFn: () => reportsAPI.getCustomerAnalytics(days),
  });
}

export function useStockTurnoverReport(days: number = 30) {
  const { user } = useAuth();
  return useQuery({
    queryKey: reportsQueryKeys.stockTurnover(days, user?.storeId),
    queryFn: () => reportsAPI.getStockTurnover(days),
  });
}

export function useProfitMarginReport(startDate?: string, endDate?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: reportsQueryKeys.profitMargin(startDate, endDate, user?.storeId),
    queryFn: () => reportsAPI.getProfitMargin(startDate as string, endDate as string),
    enabled: !!startDate && !!endDate,
  });
}
