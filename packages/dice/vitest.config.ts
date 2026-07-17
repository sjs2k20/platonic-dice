import { defineConfig } from "vitest/config";
import { resolve } from "path";

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
      "@platonic-dice/core": resolve(__dirname, "../core/src"),
      "@dice": resolve(__dirname, "./src"),
    },
  },
});
