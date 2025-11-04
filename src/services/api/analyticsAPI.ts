import api from "../api";

export const analyticsAPI = {
  getOverview: async (params?: {
    startDate?: string;
    endDate?: string;
    period?: string;
  }) => {
    const response = await api.get("/analytics/overview", { params });
    return response.data;
  },
  getSalesTrend: async (params?: { period?: string; groupBy?: string }) => {
    const response = await api.get("/analytics/sales-trend", { params });
    return response.data;
  },
  getTopProducts: async (params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) => {
    const response = await api.get("/analytics/top-products", { params });
    return response.data;
  },
  getCategoryBreakdown: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get("/analytics/category-breakdown", { params });
    return response.data;
  },
  getCustomerStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get("/analytics/customer-stats", { params });
    return response.data;
  },
  getPaymentMethods: async (params?: {
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get("/analytics/payment-methods", { params });
    return response.data;
  },
  getProfitMargin: async (params?: {
    startDate?: string;
    endDate?: string;
    categoryId?: number;
  }) => {
    const response = await api.get("/reports/profit-margin", { params });
    return response.data;
  },
  getStockTurnover: async (params?: { days?: number; categoryId?: number }) => {
    const response = await api.get("/reports/stock-turnover", { params });
    return response.data;
  },
  getSalesTrends: async (params?: {
    period?: "daily" | "weekly" | "monthly";
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get("/reports/sales-trends", { params });
    return response.data;
  },
  getCustomerAnalytics: async (params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) => {
    const response = await api.get("/reports/customer-analytics", { params });
    return response.data;
  },
};
