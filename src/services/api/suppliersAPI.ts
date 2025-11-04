import api from "../api";
import {
  Supplier,
  PaginatedResponse,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from "../../types";

export const suppliersAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Supplier>> => {
    const response = await api.get("/suppliers", { params });
    return response.data;
  },
  getById: async (id: number): Promise<Supplier> => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },
  create: async (data: CreateSupplierRequest): Promise<Supplier> => {
    const response = await api.post("/suppliers", data);
    return response.data;
  },
  update: async (
    id: number,
    data: UpdateSupplierRequest,
  ): Promise<Supplier> => {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/suppliers/${id}`);
  },
};
