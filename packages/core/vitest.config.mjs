import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: rootDir,
  test: {
    globals: true,
    environment: "node",
    include: ["__tests__/**/*.test.js"],
    setupFiles: ["./vitest.setup.js"],
    clearMocks: true,
    restoreMocks: true,
    mockReset: false,
    coverage: {
      provider: "c8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.js"],
      exclude: ["**/node_modules/**", "__tests__/**/*.test.js"],
    },
  },
  resolve: {
    alias: {
      "@platonic-dice/core": resolve(rootDir, "./src"),
    },
  },
});
