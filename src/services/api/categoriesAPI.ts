import api from "../api";
import { Category } from "../../types";

export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data;
  },
  create: async (data: FormData | { name: string }): Promise<Category> => {
    const response = await api.post("/categories", data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return response.data;
  },
  update: async (id: number, data: FormData | { name: string }): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data, {
      headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
