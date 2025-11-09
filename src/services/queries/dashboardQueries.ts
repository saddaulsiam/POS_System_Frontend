import { useQuery } from "@tanstack/react-query";
import { reportsAPI } from "../api/reportsAPI";
import { customersAPI } from "../api/customersAPI";
import { analyticsAPI } from "../api/analyticsAPI";

// Query Keys
export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
};

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Hook to fetch comprehensive dashboard stats
 * Aggregates data from multiple APIs for the admin dashboard
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);

      // Fetch all required data in parallel
      const [
        todaySalesReport,
        yesterdaySalesReport,
        weekSalesReport,
        monthSalesReport,
        inventoryReport,
        productPerformance,
        customers,
        weekCustomers,
        todaySalesRange,
        categoryBreakdown,
      ] = await Promise.all([
        reportsAPI.getSalesRange(formatDate(today), formatDate(today)),
        reportsAPI.getDailySales(formatDate(yesterday)),
        reportsAPI.getSalesRange(formatDate(weekAgo), formatDate(today)),
        reportsAPI.getSalesRange(formatDate(monthAgo), formatDate(today)),
        reportsAPI.getInventory(),
        reportsAPI.getProductPerformance(
          formatDate(weekAgo),
          formatDate(today),
          5,
        ),
        customersAPI.getAll({ page: 1, limit: 1 }),
        customersAPI.getAll({ page: 1, limit: 100 }),
        reportsAPI.getSalesRange(formatDate(today), formatDate(today)),
        analyticsAPI.getCategoryBreakdown({
          startDate: formatDate(weekAgo),
          endDate: formatDate(today),
        }),
      ]);

      // Defensive checks for required fields
      if (
        !todaySalesReport?.summary ||
        !yesterdaySalesReport?.summary ||
        !weekSalesReport?.summary ||
        !monthSalesReport?.summary
      ) {
        throw new Error("One or more sales report summaries are missing");
      }
      if (!inventoryReport?.products) {
        throw new Error("Inventory report is missing products");
      }
      if (!customers?.pagination) {
        throw new Error("Customers API response is missing pagination");
      }
      if (!Array.isArray(weekCustomers.data)) {
        throw new Error("weekCustomers.data is not an array");
      }

      // Calculate new customers this week
      const newCustomersThisWeek = weekCustomers.data.filter((c: any) => {
        const created = new Date(c.createdAt);
        return created >= weekAgo && created <= today;
      }).length;

      // Map top selling products
      const topSellingProducts = (productPerformance.products || []).map(
        (p: any) => ({
          id: p.product.id,
          name: p.product.name,
          totalSold: p.totalQuantitySold,
          revenue: p.totalRevenue,
        }),
      );

      // Map recent transactions
      const recentTransactions = (todaySalesRange.sales || [])
        .slice(0, 5)
        .map((sale: any) => ({
          id: sale.id,
          total: sale.finalAmount || sale.total || 0,
          createdAt: sale.createdAt,
          customerName: sale.customer?.name,
          itemCount: Array.isArray(sale.saleItems)
            ? sale.saleItems.reduce(
                (sum: number, item: any) => sum + (item.quantity || 0),
                0,
              )
            : 0,
        }));

      // Return aggregated stats
      return {
        todaySales: todaySalesReport.summary.totalSales ?? 0,
        yesterdaySales: yesterdaySalesReport.summary.totalSales ?? 0,
        weekSales: weekSalesReport.summary.totalSales ?? 0,
        monthSales: monthSalesReport.summary.totalSales ?? 0,
        totalProducts: inventoryReport.totalProducts ?? 0,
        activeProducts: Array.isArray(inventoryReport.products)
          ? inventoryReport.products.filter((p: any) => p.isActive).length
          : 0,
        lowStockCount: inventoryReport.lowStockCount ?? 0,
        outOfStockCount: inventoryReport.outOfStockCount ?? 0,
        totalCustomers: customers.pagination.totalItems ?? 0,
        newCustomersThisWeek,
        todayTransactions: todaySalesReport.summary.totalTransactions ?? 0,
        weekTransactions: weekSalesReport.summary.totalTransactions ?? 0,
        averageOrderValue:
          todaySalesReport.summary.totalSales &&
          todaySalesReport.summary.totalTransactions
            ? todaySalesReport.summary.totalSales /
              todaySalesReport.summary.totalTransactions
            : 0,
        topSellingProducts,
        recentTransactions,
        salesByCategory: (categoryBreakdown.categories || []).map(
          (cat: any) => ({
            category: cat.name,
            sales: cat.revenue,
            percentage: cat.percentage,
          }),
        ),
        hourlySales: [],
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes - dashboard data can be slightly stale
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
