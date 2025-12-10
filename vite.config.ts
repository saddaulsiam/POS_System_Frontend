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
        manualChunks: {
          // Separate vendor chunks for better caching
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "query-vendor": ["@tanstack/react-query"],
          "ui-vendor": ["react-hot-toast", "lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit for better chunking
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
});
 