/**
 * API Configuration
 * Centralized configuration for API endpoints
 */

export const API_CONFIG = {
  // Production API URL - Update this when deploying
  PRODUCTION_URL: "https://pos-system-1sd9.onrender.com/api",

  // Development API URL - Used in dev mode
  DEVELOPMENT_URL: "http://localhost:5000/api",

  // Fallback for proxy
  PROXY_URL: "/api",

  // Request timeout in milliseconds
  TIMEOUT: 10000,
};

/**
 * Get the appropriate API base URL based on environment
 */
export const getApiBaseUrl = (): string => {
  // Check if running in Electron
  const isElectron =
    typeof window !== "undefined" && !!(window as any).electron;

  // Check if in development mode
  const isDev = import.meta.env.DEV;

  // Get from environment variable if available
  const envBackend = import.meta.env.VITE_BACKEND_URL;

  // Priority order:
  // 1. Electron production -> use production URL
  if (isElectron && !isDev) {
    return API_CONFIG.PRODUCTION_URL;
  }

  // 2. Environment variable (if set)
  if (envBackend && envBackend !== "") {
    return envBackend;
  }

  // 3. Development mode -> use dev URL
  if (isDev) {
    return API_CONFIG.DEVELOPMENT_URL;
  }

  // 4. Fallback to production URL
  return API_CONFIG.PRODUCTION_URL;
};

/**
 * Log API configuration for debugging
 */
export const logApiConfig = () => {
  const isElectron =
    typeof window !== "undefined" && !!(window as any).electron;
  const isDev = import.meta.env.DEV;
  const baseURL = getApiBaseUrl();

  console.log("🌐 API Configuration:", {
    isElectron,
    isDev,
    baseURL,
    env: import.meta.env.VITE_BACKEND_URL,
    mode: import.meta.env.MODE,
  });
};
