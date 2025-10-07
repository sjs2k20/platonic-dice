const { isRollModifier } = require("../../src/validators");

describe("isRollModifier", () => {
  it("returns false for null, undefined, or non-functions", () => {
    expect(isRollModifier(null)).toBe(false);
    expect(isRollModifier(undefined)).toBe(false);
    expect(isRollModifier(42)).toBe(false);
    expect(isRollModifier("string")).toBe(false);
    expect(isRollModifier({})).toBe(false);
    expect(isRollModifier([])).toBe(false);
  });

  it("returns false for functions with wrong number of parameters", () => {
    const f0 = () => 1;
    const f2 = (a, b) => 1;
    expect(isRollModifier(f0)).toBe(false);
    expect(isRollModifier(f2)).toBe(false);
  });

  it("returns false for functions that do not return an integer", () => {
    const f = (x) => "not a number";
    expect(isRollModifier(f)).toBe(false);

    const f2 = (x) => 1.5;
    expect(isRollModifier(f2)).toBe(false);
  });

  it("returns true for valid integer-returning single-parameter functions", () => {
    const addOne = (x) => x + 1;
    const double = (x) => x * 2;
    expect(isRollModifier(addOne)).toBe(true);
    expect(isRollModifier(double)).toBe(true);
  });
});
