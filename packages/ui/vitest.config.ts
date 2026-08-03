import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
  },
  resolve: {
    alias: {
      "@platonic-dice/core": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../core/src",
      ),
      "@platonic-dice/dice": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../dice/src",
      ),
      "@dice": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "../dice/src",
      ),
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
      "@components": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./src/components",
      ),
      "@config": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./src/config",
      ),
      "@hooks": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./src/hooks",
      ),
      "@pages": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./src/pages",
      ),
      "@router": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./src/router",
      ),
      "@styles": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./src/styles",
      ),
      "@utils": path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        "./src/utils",
      ),
    },
  },
});
