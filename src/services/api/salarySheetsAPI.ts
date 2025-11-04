import api from "../api";

export interface SalarySheet {
  id: number;
  employeeId: number;
  employee: {
    id: number;
    name: string;
    photoUrl?: string;
    email?: string;
    phone?: string;
  };
  month: number;
  year: number;
  baseSalary: number;
  bonus: number;
  deduction: number;
  paid: boolean;
  paidAt?: string;
  createdAt: string;
}

export const salarySheetsAPI = {
  create: async (
    data: Omit<
      SalarySheet,
      "id" | "employee" | "paid" | "paidAt" | "createdAt"
    >,
  ) => {
    const response = await api.post("/salary-sheets", data);
    return response.data;
  },
  getAll: async (params?: { month?: number; year?: number }) => {
    const response = await api.get("/salary-sheets", { params });
    return response.data;
  },
  markAsPaid: async (id: number) => {
    const response = await api.post(`/salary-sheets/${id}/pay`);
    return response.data;
  },
  update: async (
    id: number,
    data: Partial<
      Omit<SalarySheet, "id" | "employee" | "paid" | "paidAt" | "createdAt">
    >,
  ) => {
    const response = await api.put(`/salary-sheets/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/salary-sheets/${id}`);
    return response.data;
  },
  bulkGenerate: async (data: { month: number; year: number }) => {
    const response = await api.post("/salary-sheets/bulk-generate", data);
    return response.data;
  },
};
