import api from "../api";

export const brandsAPI = {
  getAll: async () => {
    const response = await api.get("/brands");
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.icon) {
      formData.append("icon", data.icon);
    }
    const response = await api.post("/brands", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  update: async (id: number, data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.icon) {
      formData.append("icon", data.icon);
    }
    const response = await api.put(`/brands/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/brands/${id}`);
    return response.data;
  },
};
