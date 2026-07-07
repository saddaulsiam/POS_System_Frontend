import { PaginatedResponse, Product } from "../../types";
import {
  CreateProductRequest,
  UpdateProductRequest,
} from "../../types/productRequestTypes";
import api from "../api";

export const productsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: number;
    isActive?: boolean;
    showDeleted?: boolean;
  }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get("/products", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getByBarcode: async (barcode: string, silent = false): Promise<Product> => {
    const response = await api.get(`/products`, {
      params: { barcode },
      headers: silent ? { "X-Silent-Error": "true" } : {},
    });
    if (response.data && response.data.length > 0) {
      return response.data[0];
    } else {
      throw new Error("Product not found");
    }
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await api.post("/products", data);
    return response.data;
  },

  update: async (id: number, data: UpdateProductRequest): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  uploadImage: async (id: number, formData: FormData): Promise<Product> => {
    const response = await api.post(`/products/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteImage: async (id: number): Promise<Product> => {
    const response = await api.delete(`/products/${id}/image`);
    return response.data;
  },

  exportCSV: async (): Promise<Blob> => {
    const response = await api.get("/products/export", {
      responseType: "blob",
    });
    return response.data;
  },

  exportExcel: async (): Promise<Blob> => {
    const response = await api.get("/products/export/excel", {
      responseType: "blob",
    });
    return response.data;
  },

  downloadTemplate: async (): Promise<Blob> => {
    const response = await api.get("/products/import/template", {
      responseType: "blob",
    });
    return response.data;
  },

  downloadExcelTemplate: async (): Promise<Blob> => {
    const response = await api.get("/products/import/excel/template", {
      responseType: "blob",
    });
    return response.data;
  },

  importCSV: async (
    file: File,
  ): Promise<{
    message: string;
    imported: number;
    skipped: number;
    invalid?: Array<{ row: number; data: any; errors: string[] }>;
  }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/products/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  importExcel: async (
    file: File,
  ): Promise<{
    message: string;
    imported: number;
    duplicates: number;
    invalid: number;
    invalidDetails?: Array<{ row: number; data: any; errors: string[] }>;
  }> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/products/import/excel", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getBarcodeImage: async (id: number): Promise<string> => {
    const response = await api.get(`/products/${id}/barcode`, {
      responseType: "blob",
      params: { t: Date.now() },
    });

    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read barcode image"));
      reader.readAsDataURL(response.data);
    });
  },

  regenerateBarcode: async (id: number): Promise<Product> => {
    const response = await api.post(`/products/${id}/barcode/regenerate`);
    return response.data;
  },
};
