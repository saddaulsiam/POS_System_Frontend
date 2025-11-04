import api from "../api";

export const cashDrawerAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    employeeId?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get("/cash-drawer", { params });
    return response.data;
  },
  getCurrent: async () => {
    const response = await api.get("/cash-drawer/current");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/cash-drawer/${id}`);
    return response.data;
  },
  getReconciliation: async (id: number) => {
    const response = await api.get(`/cash-drawer/${id}/reconciliation`);
    return response.data;
  },
  open: async (data: { openingBalance: number }) => {
    const response = await api.post("/cash-drawer/open", data);
    return response.data;
  },
  close: async (
    id: number,
    data: { closingBalance: number; actualCash?: number; notes?: string },
  ) => {
    const response = await api.post(`/cash-drawer/close/${id}`, data);
    return response.data;
  },
  getStats: async (params?: {
    startDate?: string;
    endDate?: string;
    employeeId?: number;
  }) => {
    const response = await api.get("/cash-drawer/stats/summary", { params });
    return response.data;
  },
};
