import api from "../api";

export interface AdminStats {
  stats: {
    totalStores: number;
    activeSubs: number;
    trialSubs: number;
    expiredSubs: number;
    totalGMV: number;
    mrr: number;
    totalRevenue: number;
  };
  recentStores: Array<{
    id: number;
    name: string;
    createdAt: string;
    owner: {
      name: string;
      email: string | null;
      phone: string | null;
      isActive: boolean;
    };
    subscription: {
      status: string;
      trialEndDate: string;
    } | null;
  }>;
  monthlyRegs: Array<{
    month: string;
    count: number;
  }>;
}

export interface AdminStore {
  id: number;
  name: string;
  createdAt: string;
  owner: {
    id: number;
    name: string;
    username: string;
    email: string | null;
    phone: string | null;
    isActive: boolean;
  };
  subscription: {
    status: string;
    trialEndDate: string;
    subscriptionEndDate: string | null;
    plan: string | null;
  } | null;
  metrics?: {
    employeeCount: number;
    productCount: number;
    salesCount: number;
    revenue: number;
  };
}

export interface AdminSubscription {
  id: number;
  status: string;
  trialStartDate: string;
  trialEndDate: string;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
  plan: string | null;
  createdAt: string;
  updatedAt: string;
  store: {
    name: string;
    owner: {
      name: string;
      email: string | null;
    };
  };
}

export interface AdminPayment {
  id: number;
  transactionId: string;
  plan: string;
  amount: number;
  status: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  completedAt: string | null;
  store: {
    name: string;
  };
}

export const adminAPI = {
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get("/admin/stats");
    return response.data;
  },

  getStores: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{
    data: AdminStore[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const response = await api.get("/admin/stores", { params });
    return response.data;
  },

  toggleStoreStatus: async (
    id: number,
    isActive: boolean,
  ): Promise<{ message: string }> => {
    const response = await api.put(`/admin/stores/${id}/status`, { isActive });
    return response.data;
  },

  getSubscriptions: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<{
    data: AdminSubscription[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const response = await api.get("/admin/subscriptions", { params });
    return response.data;
  },

  getPayments: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{
    data: AdminPayment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const response = await api.get("/admin/payments", { params });
    return response.data;
  },

  resetOwnerPin: async (
    id: number,
    pinCode: string,
  ): Promise<{ message: string }> => {
    const response = await api.put(`/admin/stores/${id}/reset-pin`, { pinCode });
    return response.data;
  },

  updateSubscription: async (
    id: number,
    params: {
      status: string;
      plan: string;
      endDate: string | null;
    },
  ): Promise<{ message: string; subscription: any }> => {
    const response = await api.put(`/admin/stores/${id}/subscription`, params);
    return response.data;
  },

  impersonateStore: async (
    id: number,
  ): Promise<{ token: string; refreshToken: string; user: any }> => {
    const response = await api.post(`/admin/stores/${id}/impersonate`);
    return response.data;
  },

  deleteStore: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/stores/${id}`);
    return response.data;
  },
};
