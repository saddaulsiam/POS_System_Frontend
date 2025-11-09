import { useQuery } from "@tanstack/react-query";
import { reportsAPI } from "../index";

export const reportsQueryKeys = {
  inventory: () => ["reports", "inventory"] as const,
  dailySales: (date?: string) => ["reports", "dailySales", date] as const,
  salesRange: (startDate?: string, endDate?: string) =>
    ["reports", "salesRange", startDate, endDate] as const,
  employeePerformance: (startDate?: string, endDate?: string) =>
    ["reports", "employeePerformance", startDate, endDate] as const,
  productPerformance: (startDate?: string, endDate?: string, limit?: number) =>
    ["reports", "productPerformance", startDate, endDate, limit] as const,
};

export function useInventoryReport() {
  return useQuery({
    queryKey: reportsQueryKeys.inventory(),
    queryFn: () => reportsAPI.getInventory(),
  });
}

export function useDailySalesReport(date?: string) {
  return useQuery({
    queryKey: reportsQueryKeys.dailySales(date),
    queryFn: () => reportsAPI.getDailySales(date),
  });
}

export function useSalesRangeReport(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: reportsQueryKeys.salesRange(startDate, endDate),
    queryFn: () =>
      reportsAPI.getSalesRange(startDate as string, endDate as string),
    enabled: !!startDate && !!endDate,
  });
}

export function useEmployeePerformanceReport(
  startDate?: string,
  endDate?: string,
) {
  return useQuery({
    queryKey: reportsQueryKeys.employeePerformance(startDate, endDate),
    queryFn: () => reportsAPI.getEmployeePerformance(startDate, endDate),
  });
}

export function useProductPerformanceReport(
  startDate?: string,
  endDate?: string,
  limit?: number,
) {
  return useQuery({
    queryKey: reportsQueryKeys.productPerformance(startDate, endDate, limit),
    queryFn: () => reportsAPI.getProductPerformance(startDate, endDate, limit),
  });
}
