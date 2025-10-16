"use strict";
/**
 * @file RollType.test.js
 * @description
 * Comprehensive tests for the RollType entity module:
 * - RollType enum
 * - isValidRollType() validator
 *
 * These tests ensure that all exported values and helper functions behave
 * consistently and robustly across edge cases.
 */

const { RollType, isValidRollType } = require("../../src/entities/RollType.js");

describe("@dice/core/entities/RollType", () => {
  // ─────────────────────────────
  // RollType enum
  // ─────────────────────────────
  describe("RollType enum", () => {
    it("should expose exactly the expected keys", () => {
      const keys = Object.keys(RollType);
      expect(keys.sort()).toEqual(["Advantage", "Disadvantage"].sort());
    });

    it("should expose exactly the expected values", () => {
      const values = Object.values(RollType);
      expect(values.sort()).toEqual(["advantage", "disadvantage"].sort());
    });

    it("should be deeply frozen (immutable)", () => {
      expect(Object.isFrozen(RollType)).toBe(true);

      // Attempt mutation
      expect(() => {
        RollType.Advantage = "changed";
      }).toThrow();

      // Ensure it didn't change
      expect(RollType.Advantage).toBe("advantage");
    });
  });

  // ─────────────────────────────
  // isValidRollType()
  // ─────────────────────────────
  describe("isValidRollType", () => {
    it("returns true for valid roll types", () => {
      expect(isValidRollType("advantage")).toBe(true);
      expect(isValidRollType("disadvantage")).toBe(true);

      // Also check direct enum references
      expect(isValidRollType(RollType.Advantage)).toBe(true);
      expect(isValidRollType(RollType.Disadvantage)).toBe(true);
    });

    it("returns false for invalid strings", () => {
      expect(isValidRollType("normal")).toBe(false);
      expect(isValidRollType("ADVANTAGE")).toBe(false);
      expect(isValidRollType("")).toBe(false);
      expect(isValidRollType("none")).toBe(false);
    });

    it("returns false for null, undefined, or non-strings", () => {
      expect(isValidRollType(null)).toBe(false);
      expect(isValidRollType(undefined)).toBe(false);
      expect(isValidRollType(42)).toBe(false);
      expect(isValidRollType({})).toBe(false);
      expect(isValidRollType([])).toBe(false);
      expect(isValidRollType(() => "advantage")).toBe(false);
    });
  });

  // ─────────────────────────────
  // Integration sanity checks
  // ─────────────────────────────
  describe("integration behavior", () => {
    it("should validate all values from RollType successfully", () => {
      for (const value of Object.values(RollType)) {
        expect(isValidRollType(value)).toBe(true);
      }
    });

    it("should reject any value not included in RollType", () => {
      const invalid = ["foo", "bar", "ADVANTAGE", null, undefined];
      for (const v of invalid) {
        expect(isValidRollType(v)).toBe(false);
      }
    });
  });
});
