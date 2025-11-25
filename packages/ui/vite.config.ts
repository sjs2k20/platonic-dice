import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path: production (GitHub Pages) uses /platonic-dice/, dev uses /
  base: mode === "production" ? "/platonic-dice/" : "/",

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@router": path.resolve(__dirname, "./src/router"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },

  // Pre-bundle workspace dependencies for dev server
  optimizeDeps: {
    include: ["@platonic-dice/core", "@platonic-dice/dice"],
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // Handle CommonJS dependencies during production build
    // Critical: @platonic-dice/core uses CommonJS (module.exports)
    // but Vite/Rollup expects ES modules for browser
    commonjsOptions: {
      include: [/node_modules/, /packages/],
      transformMixedEsModules: true,
      defaultIsModuleExports: true,
    },
  },

  server: {
    port: 3000,
    open: true,
  },
}));
