import api from "../api";
import { Employee } from "../../types";

export const employeesAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    data: Employee[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const response = await api.get("/employees", { params });
    return response.data;
  },
  getById: async (id: number): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },
  create: async (data: {
    name: string;
    username: string;
    pinCode: string;
    role: "ADMIN" | "MANAGER" | "CASHIER" | "STAFF";
  }): Promise<Employee> => {
    const response = await api.post("/employees", data);
    return response.data;
  },
  update: async (
    id: number,
    data: {
      name?: string;
      username?: string;
      pinCode?: string;
      role?: "ADMIN" | "MANAGER" | "CASHIER" | "STAFF";
      isActive?: boolean;
    },
  ): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  uploadPhoto: async (id: number, file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("photo", file);
    const response = await api.post(`/employees/${id}/photo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  resetPin: async (
    id: number,
    newPin: string,
  ): Promise<{ message: string }> => {
    const response = await api.put(`/employees/${id}/reset-pin`, { newPin });
    return response.data;
  },
};
