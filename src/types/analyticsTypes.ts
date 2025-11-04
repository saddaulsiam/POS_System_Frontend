export type Period =
  | "today"
  | "yesterday"
  | "week"
  | "lastWeek"
  | "month"
  | "lastMonth"
  | "custom";

export interface OverviewData {
  metrics: {
    totalSales: number;
    totalRevenue: number;
    totalDiscount: number;
    totalTax: number;
    averageOrderValue: number;
    uniqueCustomers: number;
  };
  growth: {
    revenue: number;
    sales: number;
  };
  paymentMethods: Record<string, number>;
}

export interface SalesTrendData {
  period: string;
  sales: number;
  revenue: number;
  count: number;
}

export interface TopProduct {
  name: string;
  category: string;
  quantitySold: number;
  revenue: number;
  averagePrice: number;
}

export interface CategoryData {
  name: string;
  revenue: number;
  percentage: number;
}
