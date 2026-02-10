import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://pos-system-1sd9.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false, // Disable sourcemaps in production for smaller size
    minify: "terser", // Use terser for better minification
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate vendor chunks for better caching
          if (id.includes("node_modules")) {
            // React ecosystem
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("scheduler")
            ) {
              return "react-vendor";
            }
            if (id.includes("react-router")) {
              return "router-vendor";
            }
            // Query library
            if (id.includes("@tanstack/react-query")) {
              return "query-vendor";
            }
            // Charts - large library
            if (id.includes("recharts") || id.includes("d3-")) {
              return "chart-vendor";
            }
            // PDF generation - only used in reports
            if (
              id.includes("jspdf") ||
              id.includes("html2canvas") ||
              id.includes("dompurify") ||
              id.includes("canvg") ||
              id.includes("rgbcolor") ||
              id.includes("stackblur-canvas")
            ) {
              return "pdf-vendor";
            }
            // Icons
            if (id.includes("lucide-react")) {
              return "icons-vendor";
            }
            // UI utilities
            if (id.includes("react-hot-toast") || id.includes("goober")) {
              return "toast-vendor";
            }
            // HTTP client
            if (id.includes("axios") || id.includes("form-data")) {
              return "http-vendor";
            }
            // All other node_modules go to vendor
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 500, // Lower limit to encourage better splitting
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug"],
        passes: 2, // Multiple passes for better compression
      },
      mangle: {
        safari10: true, // Fix Safari 10/11 bugs
      },
      format: {
        comments: false, // Remove all comments
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "axios",
    ],
  },
});
