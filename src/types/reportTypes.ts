import { Product } from "./productTypes";
import { Employee } from "./employeeTypes";
import { PaymentMethod } from "./saleTypes";

export interface DailySalesReport {
  date: string;
  summary: {
    totalSales: number;
    totalTax: number;
    totalDiscount: number;
    totalTransactions: number;
  };
  salesByPaymentMethod: Array<{
    paymentMethod: PaymentMethod;
    _sum: { finalAmount: number };
    _count: { id: number };
  }>;
  topProducts: Array<{
    productId: number;
    _sum: { quantity: number; subtotal: number };
    product?: Product;
  }>;
}

export interface InventoryReport {
  totalProducts: number;
  totalInventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  products: Product[];
  lowStockItems: Product[];
  outOfStockItems: Product[];
}

export interface EmployeePerformanceReport {
  startDate: string;
  endDate: string;
  performance: Array<{
    employee: Employee;
    totalSales: number;
    totalTransactions: number;
    averageTransaction: number;
  }>;
}

export interface ProductPerformanceReport {
  startDate: string;
  endDate: string;
  products: Array<{
    product: Product;
    totalQuantitySold: number;
    totalRevenue: number;
    totalTransactions: number;
    estimatedProfit: number;
  }>;
}
