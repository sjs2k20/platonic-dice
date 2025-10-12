/** @type {import('jest').Config} */
module.exports = {
  // Root-level setup for the entire monorepo
  testEnvironment: "node",

  // Include tests in both packages
  roots: ["<rootDir>/packages/core", "<rootDir>/packages/dice"],

  // Match any .test.js, .spec.js, .test.ts, etc.
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],

  // So Jest understands both JS and TS as modules
  moduleFileExtensions: ["js", "ts", "json"],

  // Transform TypeScript test files using ts-jest (once you start using TS)
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { isolatedModules: true }],
  },

  // Allow requiring local workspace packages by name (e.g., "@platonic-dice/core")
  moduleNameMapper: {
    "^@platonic-dice/core(.*)$": "<rootDir>/packages/core/src$1",
    "^@platonic-dice/dice(.*)$": "<rootDir>/packages/dice/src$1",
  },

  // Optional: clean up console output a bit
  verbose: false,
};
