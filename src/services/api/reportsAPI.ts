import api from "../api";
import {
  DailySalesReport,
  InventoryReport,
  EmployeePerformanceReport,
  ProductPerformanceReport,
} from "../../types";

export const reportsAPI = {
  getDailySales: async (date?: string): Promise<DailySalesReport> => {
    const response = await api.get("/reports/daily-sales", {
      params: { date },
    });
    return response.data;
  },
  getSalesRange: async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get("/reports/sales-range", {
      params: { startDate, endDate },
    });
    return response.data;
  },
  getInventory: async (): Promise<InventoryReport> => {
    const response = await api.get("/reports/inventory");
    return response.data;
  },
  getEmployeePerformance: async (
    startDate?: string,
    endDate?: string,
  ): Promise<EmployeePerformanceReport> => {
    const response = await api.get("/reports/employee-performance", {
      params: { startDate, endDate },
    });
    return response.data;
  },
  getProductPerformance: async (
    startDate?: string,
    endDate?: string,
    limit?: number,
  ): Promise<ProductPerformanceReport> => {
    const response = await api.get("/reports/product-performance", {
      params: { startDate, endDate, limit },
    });
    return response.data;
  },
};
