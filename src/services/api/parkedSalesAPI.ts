import api from "../api";

export const parkedSalesAPI = {
  getAll: async () => {
    const response = await api.get("/parked-sales");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/parked-sales/${id}`);
    return response.data;
  },
  create: async (data: {
    customerId?: number;
    items: Array<{
      productId: number;
      productVariantId?: number;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    notes?: string;
  }) => {
    const response = await api.post("/parked-sales", data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/parked-sales/${id}`);
  },
};
