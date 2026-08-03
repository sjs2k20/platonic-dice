import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/__tests__/**/*.spec.ts", "**/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["**/__tests__/**", "dist/**"],
    },
    clearMocks: true,
  },
  resolve: {
    alias: {
      "@platonic-dice/core": path.resolve(rootDir, "../core/src"),
      "@dice": path.resolve(rootDir, "./src"),
    },
  },
});
