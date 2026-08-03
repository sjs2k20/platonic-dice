import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path: production (GitHub Pages) uses /platonic-dice/, dev uses /
  base: mode === "production" ? "/platonic-dice/" : "/",

  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
      "@components": path.resolve(rootDir, "./src/components"),
      "@config": path.resolve(rootDir, "./src/config"),
      "@hooks": path.resolve(rootDir, "./src/hooks"),
      "@pages": path.resolve(rootDir, "./src/pages"),
      "@router": path.resolve(rootDir, "./src/router"),
      "@styles": path.resolve(rootDir, "./src/styles"),
      "@utils": path.resolve(rootDir, "./src/utils"),
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
