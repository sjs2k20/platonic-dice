"use strict";
/**
 * @file Outcome.test.js
 * @description
 * Comprehensive tests for the Outcome entity module:
 * - Outcome enum
 * - isValidOutcome() validator
 *
 * These tests ensure that all exported values and helper functions behave
 * consistently and robustly across edge cases.
 */

const { Outcome, isValidOutcome } = require("../../src/entities/Outcome.js");

describe("@platonic-dice/core/entities/Outcome", () => {
  // ─────────────────────────────
  // Outcome enum
  // ─────────────────────────────
  describe("Outcome enum", () => {
    it("should expose exactly the expected keys", () => {
      const keys = Object.keys(Outcome);
      expect(keys.sort()).toEqual(
        ["Success", "Failure", "CriticalSuccess", "CriticalFailure"].sort()
      );
    });

    it("should expose exactly the expected values", () => {
      const values = Object.values(Outcome);
      expect(values.sort()).toEqual(
        ["success", "failure", "critical_success", "critical_failure"].sort()
      );
    });

    it("should be deeply frozen (immutable)", () => {
      expect(Object.isFrozen(Outcome)).toBe(true);

      // Attempt mutation
      expect(() => {
        Outcome.Success = "changed";
      }).toThrow();

      // Ensure it didn't change
      expect(Outcome.Success).toBe("success");
    });
  });

  // ─────────────────────────────
  // isValidOutcome()
  // ─────────────────────────────
  describe("isValidOutcome", () => {
    it("returns true for a valid Outcome", () => {
      expect(isValidOutcome("success")).toBe(true);
      expect(isValidOutcome("failure")).toBe(true);
      expect(isValidOutcome("critical_success")).toBe(true);
      expect(isValidOutcome("critical_failure")).toBe(true);

      // Also check direct enum references
      expect(isValidOutcome(Outcome.Success)).toBe(true);
      expect(isValidOutcome(Outcome.Failure)).toBe(true);
      expect(isValidOutcome(Outcome.CriticalSuccess)).toBe(true);
      expect(isValidOutcome(Outcome.CriticalFailure)).toBe(true);
    });

    it("returns false for invalid strings", () => {
      expect(isValidOutcome("normal")).toBe(false);
      expect(isValidOutcome("SUCCESS")).toBe(false);
      expect(isValidOutcome("")).toBe(false);
      expect(isValidOutcome("none")).toBe(false);
    });

    it("returns false for null, undefined, or non-strings", () => {
      expect(isValidOutcome(null)).toBe(false);
      expect(isValidOutcome(undefined)).toBe(false);
      expect(isValidOutcome(42)).toBe(false);
      expect(isValidOutcome({})).toBe(false);
      expect(isValidOutcome([])).toBe(false);
      expect(isValidOutcome(() => "advantage")).toBe(false);
    });
  });

  // ─────────────────────────────
  // Integration sanity checks
  // ─────────────────────────────
  describe("integration behavior", () => {
    it("should validate all values from Outcome successfully", () => {
      for (const value of Object.values(Outcome)) {
        expect(isValidOutcome(value)).toBe(true);
      }
    });

    it("should reject any value not included in Outcome", () => {
      const invalid = ["foo", "bar", "SUCCESS", null, undefined];
      for (const v of invalid) {
        expect(isValidOutcome(v)).toBe(false);
      }
    });
  });
});
