import api from "../api";

export const inventoryAPI = {
  updateStock: async (
    productId: number,
    data: {
      productVariantId?: number;
      quantity: number;
      movementType:
        | "PURCHASE"
        | "ADJUSTMENT"
        | "RETURN"
        | "DAMAGED"
        | "EXPIRED";
      reason?: string;
      reference?: string;
    },
  ) => {
    const response = await api.post(`/inventory/adjust`, {
      productId,
      ...data,
    });
    return response.data;
  },
  getStockMovements: async (
    productId?: number,
    params?: {
      page?: number;
      limit?: number;
      startDate?: string;
      endDate?: string;
    },
  ) => {
    const response = await api.get("/inventory/movements", {
      params: { productId, ...params },
    });
    return response.data;
  },
  adjustStock: async (data: {
    productId: number;
    productVariantId?: number;
    quantity: number;
    reason: "DAMAGED" | "EXPIRED" | "LOST" | "FOUND" | "COUNT_ADJUSTMENT";
    notes?: string;
  }) => {
    const response = await api.post("/inventory/adjust", data);
    return response.data;
  },
  transferStock: async (data: {
    productId: number;
    productVariantId?: number;
    quantity: number;
    fromLocation: string;
    toLocation: string;
    notes?: string;
  }) => {
    const response = await api.post("/inventory/transfer", data);
    return response.data;
  },
  getAlerts: async (params?: {
    alertType?: "LOW_STOCK" | "OUT_OF_STOCK" | "EXPIRING_SOON" | "DAMAGED";
    isResolved?: boolean;
  }) => {
    const response = await api.get("/inventory/alerts", { params });
    return response.data;
  },
  resolveAlert: async (alertId: number) => {
    const response = await api.put(`/inventory/alerts/${alertId}/resolve`);
    return response.data;
  },
  receivePurchaseOrder: async (data: {
    purchaseOrderId: number;
    items: Array<{
      purchaseOrderItemId: number;
      quantityReceived: number;
      notes?: string;
    }>;
  }) => {
    const response = await api.post("/inventory/receive-po", data);
    return response.data;
  },
  getAllPurchaseOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    supplierId?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await api.get("/inventory/purchase-orders", { params });
    return response.data;
  },
  getPurchaseOrderById: async (id: number) => {
    const response = await api.get(`/inventory/purchase-orders/${id}`);
    return response.data;
  },
  createPurchaseOrder: async (data: {
    supplierId: number;
    orderDate: string;
    expectedDate?: string;
    items: Array<{
      productId: number;
      variantId?: number;
      quantity: number;
      unitPrice: number;
    }>;
    notes?: string;
  }) => {
    const response = await api.post("/inventory/purchase-orders", data);
    return response.data;
  },
  updatePurchaseOrder: async (
    id: number,
    data: {
      supplierId?: number;
      orderDate?: string;
      expectedDate?: string;
      notes?: string;
      items?: Array<{
        productId: number;
        quantity: number;
        unitPrice: number;
      }>;
    },
  ) => {
    const response = await api.put(`/inventory/purchase-orders/${id}`, data);
    return response.data;
  },
  receiveItems: async (
    id: number,
    items: Array<{
      itemId: number;
      receivedQuantity: number;
    }>,
  ) => {
    const response = await api.post(
      `/inventory/purchase-orders/${id}/receive`,
      { items },
    );
    return response.data;
  },
  cancelPurchaseOrder: async (id: number) => {
    const response = await api.delete(`/inventory/purchase-orders/${id}`);
    return response.data;
  },
  getPurchaseOrderStats: async (params?: {
    startDate?: string;
    endDate?: string;
    supplierId?: number;
  }) => {
    const response = await api.get("/inventory/purchase-orders/stats/summary", {
      params,
    });
    return response.data;
  },
};
