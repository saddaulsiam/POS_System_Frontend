import api from "../api";

export const posSettingsAPI = {
  get: async () => {
    const response = await api.get("/pos-settings");
    return response.data;
  },
  update: async (settings: any) => {
    const response = await api.put("/pos-settings", settings);
    return response.data;
  },
  updatePOSSettings: async (settings: any) => {
    const response = await api.put("/pos-settings", settings);
    return response.data;
  },
};
