"use strict";
/**
 * @file DieType.test.js
 * @description
 * Comprehensive tests for the DieType entity module:
 * - DieType enum
 * - isValidDieType() validator
 *
 * These tests ensure that all exported values and helper functions behave
 * consistently and robustly across edge cases.
 */

const { DieType, isValidDieType } = require("../../src/entities/DieType.js");

describe("@dice/core/entities/DieType", () => {
  // ─────────────────────────────
  // DieType enum
  // ─────────────────────────────
  describe("DieType enum", () => {
    it("should expose exactly the expected keys", () => {
      const keys = Object.keys(DieType);
      expect(keys.sort()).toEqual(
        ["D4", "D6", "D8", "D10", "D12", "D20"].sort()
      );
    });

    it("should expose exactly the expected values", () => {
      const values = Object.values(DieType);
      expect(values.sort()).toEqual(
        ["d4", "d6", "d8", "d10", "d12", "d20"].sort()
      );
    });

    it("should be deeply frozen (immutable)", () => {
      expect(Object.isFrozen(DieType)).toBe(true);

      // Attempt mutation
      expect(() => {
        DieType.D6 = "changed";
      }).toThrow();

      // Ensure it didn't change
      expect(DieType.D6).toBe("d6");
    });
  });

  // ─────────────────────────────
  // isValidDieType()
  // ─────────────────────────────
  describe("isValidDieType", () => {
    it("returns true for valid die types", () => {
      expect(isValidDieType("d4")).toBe(true);
      expect(isValidDieType("d6")).toBe(true);
      expect(isValidDieType("d8")).toBe(true);
      expect(isValidDieType("d10")).toBe(true);
      expect(isValidDieType("d12")).toBe(true);
      expect(isValidDieType("d20")).toBe(true);

      // Also check direct enum references
      expect(isValidDieType(DieType.D4)).toBe(true);
      expect(isValidDieType(DieType.D6)).toBe(true);
      expect(isValidDieType(DieType.D8)).toBe(true);
      expect(isValidDieType(DieType.D10)).toBe(true);
      expect(isValidDieType(DieType.D12)).toBe(true);
      expect(isValidDieType(DieType.D20)).toBe(true);
    });

    it("returns false for invalid strings", () => {
      expect(isValidDieType("normal")).toBe(false);
      expect(isValidDieType("D6")).toBe(false);
      expect(isValidDieType("")).toBe(false);
      expect(isValidDieType("none")).toBe(false);
    });

    it("returns false for null, undefined, or non-strings", () => {
      expect(isValidDieType(null)).toBe(false);
      expect(isValidDieType(undefined)).toBe(false);
      expect(isValidDieType(42)).toBe(false);
      expect(isValidDieType({})).toBe(false);
      expect(isValidDieType([])).toBe(false);
      expect(isValidDieType(() => "advantage")).toBe(false);
    });
  });

  // ─────────────────────────────
  // Integration sanity checks
  // ─────────────────────────────
  describe("integration behavior", () => {
    it("should validate all values from DieType successfully", () => {
      for (const value of Object.values(DieType)) {
        expect(isValidDieType(value)).toBe(true);
      }
    });

    it("should reject any value not included in DieType", () => {
      const invalid = ["foo", "bar", "D6", null, undefined];
      for (const v of invalid) {
        expect(isValidDieType(v)).toBe(false);
      }
    });
  });
});
