import api from "../api";

export const receiptsAPI = {
  generate: async (
    saleId: number,
    format: "PDF" | "HTML" | "THERMAL" = "PDF",
  ): Promise<Blob> => {
    const response = await api.get(`/receipts/${saleId}/generate`, {
      params: { format },
      responseType: format === "HTML" ? "text" : "blob",
    });
    return response.data;
  },
  preview: async (saleId: number) => {
    const response = await api.get(`/receipts/${saleId}/preview`);
    return response.data;
  },
  getHTML: async (saleId: number): Promise<string> => {
    const response = await api.get(`/receipts/${saleId}/html`, {
      responseType: "text",
    });
    return response.data;
  },
  send: async (data: {
    saleId: number;
    customerEmail: string;
    customerName?: string;
    includePDF?: boolean;
  }) => {
    const response = await api.post("/receipts/send-email", data);
    return response.data;
  },
  print: async (saleId: number, printerName?: string) => {
    const response = await api.post("/receipts/print", {
      saleId,
      printerName,
    });
    return response.data;
  },
  bulkSend: async (data: {
    saleIds: number[];
    customerEmail: string;
    customerName?: string;
  }) => {
    const response = await api.post("/receipts/bulk-send", data);
    return response.data;
  },
  getStoreSettings: async () => {
    const response = await api.get("/receipts/store-settings");
    return response.data;
  },
  updateStoreSettings: async (data: {
    storeName?: string;
    storeAddress?: string;
    storePhone?: string;
    storeEmail?: string;
    taxId?: string;
    returnPolicy?: string;
  }) => {
    const response = await api.put("/receipts/store-settings", data);
    return response.data;
  },
  getThermal: async (saleId: number): Promise<string> => {
    const response = await api.get(`/receipts/${saleId}/thermal`, {
      responseType: "text",
    });
    return response.data;
  },
};
