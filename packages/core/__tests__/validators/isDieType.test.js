const { isDieType } = require("../../src/validators");
const { DieType } = require("../../src/entities");

describe("isDieType", () => {
  it("returns false for null, undefined, or empty string", () => {
    expect(isDieType(null)).toBe(false);
    expect(isDieType(undefined)).toBe(false);
    expect(isDieType("")).toBe(false);
  });

  it("returns true for all valid DieType values", () => {
    Object.values(DieType).forEach((value) => {
      expect(isDieType(value)).toBe(true);
    });
  });

  it("returns false for invalid strings", () => {
    expect(isDieType("d1")).toBe(false);
    expect(isDieType("invalid")).toBe(false);
    expect(isDieType("d100")).toBe(false);
  });
});
