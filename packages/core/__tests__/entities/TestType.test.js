"use strict";
/**
 * @file TestType.test.js
 * @description
 * Comprehensive tests for the TestType entity module:
 * - TestType enum
 * - isValidTestType() validator
 *
 * These tests ensure that all exported values and helper functions behave
 * consistently and robustly across edge cases.
 */

const { TestType, isValidTestType } = require("../../src/entities/TestType.js");

describe("@dice/core/entities/TestType", () => {
  // ─────────────────────────────
  // TestType enum
  // ─────────────────────────────
  describe("TestType enum", () => {
    it("should expose exactly the expected keys", () => {
      const keys = Object.keys(TestType);
      expect(keys.sort()).toEqual(
        ["Exact", "AtLeast", "AtMost", "Within", "InList", "Skill"].sort()
      );
    });

    it("should expose exactly the expected values", () => {
      const values = Object.values(TestType);
      expect(values.sort()).toEqual(
        ["exact", "at_least", "at_most", "within", "in_list", "skill"].sort()
      );
    });

    it("should be deeply frozen (immutable)", () => {
      expect(Object.isFrozen(TestType)).toBe(true);

      // Attempt mutation
      expect(() => {
        TestType.Exact = "changed";
      }).toThrow();

      // Ensure it didn't change
      expect(TestType.Exact).toBe("exact");
    });
  });

  // ─────────────────────────────
  // isValidTestType()
  // ─────────────────────────────
  describe("isValidTestType", () => {
    it("returns true for valid test types", () => {
      expect(isValidTestType("exact")).toBe(true);
      expect(isValidTestType("at_least")).toBe(true);
      expect(isValidTestType("at_most")).toBe(true);
      expect(isValidTestType("within")).toBe(true);
      expect(isValidTestType("in_list")).toBe(true);
      expect(isValidTestType("skill")).toBe(true);

      // Also check direct enum references
      expect(isValidTestType(TestType.Exact)).toBe(true);
      expect(isValidTestType(TestType.AtLeast)).toBe(true);
      expect(isValidTestType(TestType.AtMost)).toBe(true);
      expect(isValidTestType(TestType.Within)).toBe(true);
      expect(isValidTestType(TestType.InList)).toBe(true);
      expect(isValidTestType(TestType.Skill)).toBe(true);
    });

    it("returns false for invalid strings", () => {
      expect(isValidTestType("normal")).toBe(false);
      expect(isValidTestType("EXACT")).toBe(false);
      expect(isValidTestType("")).toBe(false);
      expect(isValidTestType("none")).toBe(false);
    });

    it("returns false for null, undefined, or non-strings", () => {
      expect(isValidTestType(null)).toBe(false);
      expect(isValidTestType(undefined)).toBe(false);
      expect(isValidTestType(42)).toBe(false);
      expect(isValidTestType({})).toBe(false);
      expect(isValidTestType([])).toBe(false);
      expect(isValidTestType(() => "advantage")).toBe(false);
    });
  });

  // ─────────────────────────────
  // Integration sanity checks
  // ─────────────────────────────
  describe("integration behavior", () => {
    it("should validate all values from TestType successfully", () => {
      for (const value of Object.values(TestType)) {
        expect(isValidTestType(value)).toBe(true);
      }
    });

    it("should reject any value not included in TestType", () => {
      const invalid = ["foo", "bar", "EXACT", null, undefined];
      for (const v of invalid) {
        expect(isValidTestType(v)).toBe(false);
      }
    });
  });
});
