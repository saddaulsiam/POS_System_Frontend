import api from "../api";

export const quickSaleItemsAPI = {
  getAll: async () => {
    const response = await api.get("/quick-sale-items");
    return response.data;
  },
  create: async (data: {
    productId: number;
    displayName: string;
    color: string;
    sortOrder: number;
  }) => {
    const response = await api.post("/quick-sale-items", data);
    return response.data;
  },
  update: async (
    id: number,
    data: {
      displayName?: string;
      color?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ) => {
    const response = await api.put(`/quick-sale-items/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    await api.delete(`/quick-sale-items/${id}`);
  },
};
