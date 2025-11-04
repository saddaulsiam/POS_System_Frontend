import api from "../api";

export const notificationsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{ data: any[]; pagination: any }> => {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const response = await api.get(`/notification?page=${page}&limit=${limit}`);
    return {
      data: response.data.data || [],
      pagination: response.data.pagination || {
        page,
        limit,
        total: 0,
        pages: 1,
      },
    };
  },
  markAsRead: async (id: number): Promise<void> => {
    await api.post(`/notification/${id}/read`);
  },
};
