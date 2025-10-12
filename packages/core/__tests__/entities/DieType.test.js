"use strict";
const { DieType } = require("../../src/entities/DieType.js");

describe("@dice/core/entities/DieType", () => {
  it("should be an object", () => {
    expect(typeof DieType).toBe("object");
  });

  it("should be frozen (immutable)", () => {
    expect(Object.isFrozen(DieType)).toBe(true);
  });

  it("should contain all expected die types", () => {
    const expected = {
      D4: "d4",
      D6: "d6",
      D8: "d8",
      D10: "d10",
      D12: "d12",
      D20: "d20",
    };
    expect(DieType).toEqual(expected);
  });

  it("should have uppercase keys and lowercase string values", () => {
    for (const [key, value] of Object.entries(DieType)) {
      expect(key).toMatch(/^D\d+$/);
      expect(value).toMatch(/^d\d+$/);
      expect(value.toLowerCase()).toBe(value);
    }
  });

  it("should not allow new properties to be added", () => {
    expect(() => {
      // @ts-ignore
      DieType.D100 = "d100";
    }).toThrow();
    expect(DieType.D100).toBeUndefined();
  });

  it("should not allow existing values to be modified", () => {
    expect(() => {
      // @ts-ignore
      DieType.D6 = "foo";
    }).toThrow();
    expect(DieType.D6).toBe("d6");
  });
});
