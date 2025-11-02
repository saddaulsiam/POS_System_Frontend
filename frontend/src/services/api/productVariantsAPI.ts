import api from "../api";

export const productVariantsAPI = {
  create: async (data: any) => {
    return (await api.post("/product-variants", data)).data;
  },
  getAll: async (params?: {
    productId?: number;
    page?: number;
    limit?: number;
  }) => {
    return (await api.get("/product-variants", { params })).data;
  },
  getById: async (id: number) => {
    return (await api.get(`/product-variants/${id}`)).data;
  },
  update: async (id: number, data: any) => {
    return (await api.put(`/product-variants/${id}`, data)).data;
  },
  delete: async (id: number) => {
    await api.delete(`/product-variants/${id}`);
  },
  lookup: async (barcode: string) => {
    return (await api.get(`/product-variants/lookup/${barcode}`)).data;
  },
};
