"use strict";

/**
 * @file
 * @module @platonic-dice/core/__tests__/utils/generateResult.test.js
 * @description
 * Comprehensive test suite for the `generateResult` utility.
 * Ensures correctness of returned values, validation of die types,
 * and statistical reasonableness of the random number distribution.
 */

const { DieType } = require("../../src/entities");
const { generateResult } = require("../../src/utils/generateResult");

describe("@platonic-dice/core/utils/generateResult", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("validation", () => {
    it("should throw a TypeError if dieType is invalid", () => {
      expect(() => generateResult("banana")).toThrow(TypeError);
      expect(() => generateResult("banana")).toThrow(
        "Invalid die type: banana"
      );
    });
  });

  describe("behaviour", () => {
    it("should always return an integer between 1 and the die's maximum sides", () => {
      const sidesMap = {
        [DieType.D4]: 4,
        [DieType.D6]: 6,
        [DieType.D8]: 8,
        [DieType.D10]: 10,
        [DieType.D12]: 12,
        [DieType.D20]: 20,
      };

      for (const [die, sides] of Object.entries(sidesMap)) {
        const result = generateResult(die);
        expect(Number.isInteger(result)).toBe(true);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(sides);
      }
    });

    it("should produce predictable output when Math.random is mocked", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.5);
      // For d20: floor(0.5 * 20) + 1 = 11
      expect(generateResult(DieType.D20)).toBe(11);
    });

    it("should return 1 when Math.random returns 0", () => {
      jest.spyOn(Math, "random").mockReturnValue(0);
      expect(generateResult(DieType.D10)).toBe(1);
    });

    it("should return max side when Math.random returns a value very close to 1", () => {
      jest.spyOn(Math, "random").mockReturnValue(0.999999);
      expect(generateResult(DieType.D10)).toBe(10);
    });
  });

  describe("statistical sanity", () => {
    it("should roughly produce uniform results over many rolls", () => {
      const rolls = 10000;
      const sides = 6;
      const counts = new Array(sides).fill(0);

      for (let i = 0; i < rolls; i++) {
        const r = generateResult(DieType.D6);
        counts[r - 1]++;
      }

      const avg = rolls / sides;
      const tolerance = avg * 0.2; // allow 20% variance
      counts.forEach((count) => {
        expect(count).toBeGreaterThanOrEqual(avg - tolerance);
        expect(count).toBeLessThanOrEqual(avg + tolerance);
      });
    });
  });

  describe("integration and edge cases", () => {
    it("should handle all supported DieType values without throwing", () => {
      Object.values(DieType).forEach((die) => {
        expect(() => generateResult(die)).not.toThrow();
      });
    });

    it("should return different values on different invocations (statistically likely)", () => {
      const r1 = generateResult(DieType.D20);
      const r2 = generateResult(DieType.D20);
      // If by chance equal, roll again
      if (r1 === r2) {
        const r3 = generateResult(DieType.D20);
        expect(r3).not.toBe(r1);
      } else {
        expect(r1).not.toBe(r2);
      }
    });
  });
});
