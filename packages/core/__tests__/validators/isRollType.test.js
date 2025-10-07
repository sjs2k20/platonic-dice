const { isRollType } = require("../../src/validators");
const { RollType } = require("../../src/entities");

describe("isRollType", () => {
  it("returns false for null, undefined, or empty string", () => {
    expect(isRollType(null)).toBe(false);
    expect(isRollType(undefined)).toBe(false);
    expect(isRollType("")).toBe(false);
  });

  it("returns true for all valid RollType values", () => {
    Object.values(RollType).forEach((value) => {
      expect(isRollType(value)).toBe(true);
    });
  });

  it("returns false for invalid strings", () => {
    expect(isRollType("invalid")).toBe(false);
    expect(isRollType("rollX")).toBe(false);
    expect(isRollType("123")).toBe(false);
  });
});
