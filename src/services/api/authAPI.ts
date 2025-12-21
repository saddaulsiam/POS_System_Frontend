import { AuthResponse, LoginRequest } from "../../types";
import api from "../api";

export const authAPI = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log("🔐 Attempting login with credentials:", {
        username: credentials.username,
        pinCodeLength: credentials.pinCode?.length || 0,
      });

      const response = await api.post<AuthResponse>("/auth/login", credentials);

      console.log("✅ Login successful:", {
        status: response.status,
        hasToken: !!response.data.token,
        tokenLength: response.data.token?.length || 0,
        user: response.data.user,
      });

      return response.data;
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  changePin: async (data: { currentPin: string; newPin: string }) => {
    const response = await api.put("/auth/change-pin", data);
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  updateProfile: async (data: {
    name?: string;
    username?: string;
    email?: string;
  }) => {
    const response = await api.put("/profile/me", data);
    return response.data;
  },
};
