import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";

const envBackend = import.meta.env.VITE_BACKEND_URL;

const baseURL = envBackend && envBackend !== "" ? envBackend : "/api";

const api = axios.create({
  baseURL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log("🔄 API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      params: config.params,
    });

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 Token added to request");
    } else {
      console.log("⚠️ No token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("✅ API Response:", {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ API Error Response:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    });

    // Don't show toast for 404 on variant lookup (used for barcode scanning)
    const isVariantLookup404 =
      error.config?.url?.includes("/product-variants/lookup/") &&
      error.response?.status === 404;

    if (error.response?.status === 401) {
      console.log("🚪 401 Unauthorized - Clearing auth data");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Use hash-based redirect for Electron/production
      if (window.location.protocol === "file:") {
        window.location.hash = "#/login";
      } else {
        window.location.href = "/login";
      }
      toast.error("Session expired. Please log in again.");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    } else if (error.response?.data?.error && !isVariantLookup404) {
      // Show error toast unless it's a variant lookup 404
      toast.error(error.response.data.error);
    } else if (error.message && !isVariantLookup404) {
      toast.error(error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
