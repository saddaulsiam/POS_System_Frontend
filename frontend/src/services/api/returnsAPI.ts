import api from "../api";

export const returnsAPI = {
  processReturn: async (
    saleId: number,
    data: {
      items: Array<{
        saleItemId: number;
        quantity: number;
        condition: "NEW" | "OPENED" | "DAMAGED" | "DEFECTIVE";
      }>;
      reason: string;
      refundMethod: "CASH" | "ORIGINAL_PAYMENT" | "STORE_CREDIT" | "EXCHANGE";
      restockingFee?: number;
      exchangeProductId?: number;
      notes?: string;
    },
  ) => {
    const response = await api.post(`/sales/${saleId}/return`, data);
    return response.data;
  },
  getReturnHistory: async (params?: {
    customerId?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get("/sales/returns", { params });
    return response.data;
  },
  getReturnById: async (saleId: number) => {
    const response = await api.get(`/sales/${saleId}/return`);
    return response.data;
  },
};
