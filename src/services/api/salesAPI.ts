import api from "../api";
import { Sale, PaginatedResponse, CreateSaleRequest } from "../../types";

export const salesAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    employeeId?: number;
    customerId?: number;
  }): Promise<PaginatedResponse<Sale>> => {
    const response = await api.get("/sales", { params });
    return response.data;
  },
  getById: async (id: number): Promise<Sale> => {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },
  getByReceiptId: async (receiptId: string): Promise<Sale> => {
    const response = await api.get(`/sales/${receiptId}`);
    return response.data;
  },
  create: async (data: CreateSaleRequest): Promise<Sale> => {
    const response = await api.post("/sales", data);
    return response.data;
  },
  processRefund: async (
    id: number,
    data: {
      items: Array<{ saleItemId: number; quantity: number }>;
      reason?: string;
    },
  ): Promise<Sale> => {
    const response = await api.post(`/sales/${id}/refund`, data);
    return response.data;
  },
  void: async (id: number, reason?: string): Promise<void> => {
    await api.post(`/sales/${id}/void`, { reason });
  },
  voidSale: async (
    id: number,
    data: { reason: string; password?: string; restoreStock?: boolean },
  ): Promise<{ message: string; sale: Sale }> => {
    const response = await api.post(`/sales/${id}/void`, data);
    return response.data;
  },
};
