const { isTestType } = require("../../src/validators");
const { TestType } = require("../../src/entities");

describe("isTestType", () => {
  it("returns false for null, undefined, or empty string", () => {
    expect(isTestType(null)).toBe(false);
    expect(isTestType(undefined)).toBe(false);
    expect(isTestType("")).toBe(false);
  });

  it("returns true for all valid TestType values", () => {
    Object.values(TestType).forEach((value) => {
      expect(isTestType(value)).toBe(true);
    });
  });

  it("returns false for invalid strings", () => {
    expect(isTestType("invalid")).toBe(false);
    expect(isTestType("testX")).toBe(false);
    expect(isTestType("123")).toBe(false);
  });
});
