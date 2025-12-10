import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { SettingsProvider } from "./context/SettingsContext.tsx";
import { SubscriptionProvider } from "./context/SubscriptionContext.tsx";
import "./index.css";

// Use HashRouter for Electron (file:// protocol) and BrowserRouter for web
const Router =
  window.location.protocol === "file:" ? HashRouter : BrowserRouter;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: (failureCount, error: any) => {
        if (error?.response?.status === 401) {
          return false;
        }
        return failureCount < 1;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <SubscriptionProvider>
            <SettingsProvider>
              <App />
              <Toaster
                position="top-right"
                gutter={8}
                toastOptions={{
                  duration: 3000, // Reduced from 4000ms
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                  success: {
                    duration: 2000, // Reduced from 3000ms
                    style: {
                      background: "#10b981",
                    },
                  },
                  error: {
                    duration: 4000, // Reduced from 5000ms
                    style: {
                      background: "#ef4444",
                    },
                  },
                }}
              />
            </SettingsProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </Router>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </React.StrictMode>,
);
