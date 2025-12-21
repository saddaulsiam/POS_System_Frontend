import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { getApiBaseUrl, logApiConfig, API_CONFIG } from "../config/apiConfig";

// Get the appropriate base URL for the current environment
const baseURL = getApiBaseUrl();

// Log configuration for debugging
logApiConfig();

const api = axios.create({
  baseURL,
  timeout: API_CONFIG.TIMEOUT,
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

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
  async (error) => {
    console.error("❌ API Error Response:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message,
    });

    // Check if request should suppress error toasts
    const silentError = error.config?.headers?.["X-Silent-Error"] === "true";

    // Don't show toast for 404 on variant lookup (used for barcode scanning)
    const isVariantLookup404 =
      error.config?.url?.includes("/product-variants/lookup/") &&
      error.response?.status === 404;

    // Don't show toast for product barcode lookup (used in POS barcode scanner)
    const isBarcodeNotFound =
      error.config?.url?.includes("/products/barcode/") &&
      error.response?.status === 404;

    // Handle timeout errors with friendly message
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      if (!silentError) {
        toast.error("Connection timeout. Please try again.", {
          duration: 5000,
        });
      }
      return Promise.reject(error);
    }

    // Handle network/connection errors
    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      if (!silentError) {
        toast.error("Unable to connect to server. Please try again.", {
          duration: 5000,
        });
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      console.log("🚪 401 Unauthorized");

      // Check if this is a login attempt (no token in request)
      const hasToken = error.config?.headers?.Authorization;
      const originalRequest = error.config;

      // Skip refresh for login/refresh endpoints
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/refresh")
      ) {
        if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        }
        return Promise.reject(error);
      }

      if (hasToken) {
        // Token exists but is invalid/expired - try to refresh
        console.log("🔄 Attempting to refresh token");

        if (isRefreshing) {
          // Queue this request until refresh completes
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        isRefreshing = true;

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          console.log("🚪 No refresh token - Logging out");
          isRefreshing = false;
          processQueue(new Error("No refresh token"), null);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          if (window.location.protocol === "file:") {
            window.location.hash = "#/login";
          } else {
            window.location.href = "/login";
          }
          toast.error("Session expired. Please log in again.");
          return Promise.reject(error);
        }

        try {
          // Call refresh endpoint without interceptor to avoid infinite loop
          const response = await axios.post(
            `${baseURL}/auth/refresh`,
            { refreshToken },
            { headers: { "X-Silent-Error": "true" } },
          );

          const { token: newAccessToken } = response.data;

          console.log("✅ Token refreshed successfully");

          // Update token in localStorage
          localStorage.setItem("token", newAccessToken);

          // Update original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Process queued requests with new token
          processQueue(null, newAccessToken);

          isRefreshing = false;

          // Retry original request
          return api(originalRequest);
        } catch (refreshError) {
          console.log("❌ Token refresh failed - Logging out");
          isRefreshing = false;
          processQueue(refreshError, null);

          // Clear all auth data
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");

          // Redirect to login
          if (window.location.protocol === "file:") {
            window.location.hash = "#/login";
          } else {
            window.location.href = "/login";
          }
          toast.error("Session expired. Please log in again.");
          return Promise.reject(refreshError);
        }
      } else {
        // No token - this is a login failure, show backend error
        if (error.response?.data?.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error("Invalid credentials");
        }
      }
      // Don't continue to other error handlers for 401
      return Promise.reject(error);
    } else if (error.response?.status >= 500 && !silentError) {
      toast.error("Server error. Please try again later.");
    } else if (
      error.response?.data?.error &&
      !isVariantLookup404 &&
      !isBarcodeNotFound &&
      !silentError
    ) {
      // Show error toast unless it's a variant lookup 404 or barcode not found
      toast.error(error.response.data.error);
    } else if (
      error.message &&
      !isVariantLookup404 &&
      !isBarcodeNotFound &&
      !silentError
    ) {
      toast.error(error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
