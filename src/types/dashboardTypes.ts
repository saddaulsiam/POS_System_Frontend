export interface DashboardStats {
  todaySales: number;
  yesterdaySales: number;
  weekSales: number;
  monthSales: number;
  totalProducts: number;
  activeProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalCustomers: number;
  newCustomersThisWeek: number;
  todayTransactions: number;
  weekTransactions: number;
  averageOrderValue: number;
  topSellingProducts: Array<{
    id: number;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
  recentTransactions: Array<{
    id: number;
    total: number;
    createdAt: string;
    customerName?: string;
    itemCount: number;
  }>;
  salesByCategory: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
  hourlySales: Array<{
    hour: number;
    sales: number;
  }>;
}
