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
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
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
            if (id.includes("@tanstack/react-query")) {
              return "query-vendor";
            }
            if (id.includes("recharts") || id.includes("d3-")) {
              return "chart-vendor";
            }
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
            if (id.includes("lucide-react")) {
              return "icons-vendor";
            }
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
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
