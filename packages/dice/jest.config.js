module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  moduleNameMapper: {
    "^@platonic-dice/core(.*)$": "<rootDir>/../core/src$1",
  },
};
