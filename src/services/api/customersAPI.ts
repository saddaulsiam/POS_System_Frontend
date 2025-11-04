import api from "../api";
import {
  Customer,
  PaginatedResponse,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "../../types";

export const customersAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Customer>> => {
    const response = await api.get("/customers", { params });
    return response.data;
  },
  getById: async (id: number): Promise<Customer> => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },
  getByPhone: async (phone: string): Promise<Customer> => {
    const response = await api.get(`/customers/phone/${phone}`);
    return response.data;
  },
  create: async (data: CreateCustomerRequest): Promise<Customer> => {
    const response = await api.post("/customers", data);
    return response.data;
  },
  update: async (
    id: number,
    data: UpdateCustomerRequest,
  ): Promise<Customer> => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};
