/**
 * @file RollModifier.test.js
 * @description
 * Comprehensive tests for the RollModifier entity and its helper functions:
 * - RollModifier class
 * - normaliseRollModifier()
 * - isValidRollModifier()
 *
 * These tests assume the module exports all three from:
 * `packages/core/src/entities/RollModifier.js`
 */

const {
  RollModifier,
  normaliseRollModifier,
  isValidRollModifier,
} = require("../../src/entities/RollModifier.js");

describe("@dice/core/entities/RollModifier", () => {
  // ─────────────────────────────
  // Constructor
  // ─────────────────────────────
  describe("constructor", () => {
    it("should create an instance when a valid modifier function is provided", () => {
      const mockFn = (n) => n + 2;
      const modifier = new RollModifier(mockFn);

      expect(modifier).toBeInstanceOf(RollModifier);
      expect(modifier.fn).toBe(mockFn);
    });

    it("should throw a TypeError if the function is invalid", () => {
      const invalidFn = "not-a-function";
      expect(() => new RollModifier(invalidFn)).toThrow(TypeError);
      expect(() => new RollModifier(invalidFn)).toThrow(
        /Invalid roll modifier/
      );
    });

    it("should store the function reference exactly as provided", () => {
      const fn = (x) => x * 2;
      const mod = new RollModifier(fn);
      expect(mod.fn).toBe(fn);
    });
  });

  // ─────────────────────────────
  // apply()
  // ─────────────────────────────
  describe("apply", () => {
    it("should apply the stored modifier function to a base value", () => {
      const mockFn = (n) => n + 3;
      const modifier = new RollModifier(mockFn);
      const result = modifier.apply(5);

      expect(result).toBe(8);
    });

    it("should return the function’s result directly", () => {
      const mockFn = (n) => n - 1;
      const modifier = new RollModifier(mockFn);

      expect(modifier.apply(10)).toBe(9);
      expect(modifier.apply(0)).toBe(-1);
    });

    it("should propagate errors thrown by the modifier function", () => {
      const mockFn = () => {
        throw new Error("Boom!");
      };
      const modifier = new RollModifier((n) => n); // valid one
      modifier.fn = mockFn; // manually inject throwing fn

      expect(() => modifier.apply(7)).toThrow("Boom!");
    });
  });

  // ─────────────────────────────
  // validate()
  // ─────────────────────────────
  describe("validate", () => {
    it("should not throw if the function is still valid", () => {
      const mockFn = (n) => n * 2;
      const modifier = new RollModifier(mockFn);
      expect(() => modifier.validate()).not.toThrow();
    });

    it("should throw a TypeError if the stored fn becomes invalid", () => {
      const mod = new RollModifier((n) => n + 1);
      // Corrupt its fn to simulate invalid state
      mod.fn = "not-a-function";
      expect(() => mod.validate()).toThrow(TypeError);
      expect(() => mod.validate()).toThrow(/Invalid roll modifier/);
    });
  });

  // ─────────────────────────────
  // Integration Behavior
  // ─────────────────────────────
  describe("integration behavior", () => {
    it("should work as expected with the identity modifier", () => {
      const identity = (n) => n;
      const mod = new RollModifier(identity);
      expect(mod.apply(5)).toBe(5);
      expect(mod.apply(0)).toBe(0);
    });

    it("should work correctly when chained manually", () => {
      const add2 = (n) => n + 2;
      const double = (n) => n * 2;
      const mod1 = new RollModifier(add2);
      const mod2 = new RollModifier(double);

      const base = 4;
      const result = mod2.apply(mod1.apply(base));

      expect(result).toBe(12); // (4 + 2) * 2 = 12
    });
  });

  // ─────────────────────────────
  // normaliseRollModifier()
  // ─────────────────────────────
  describe("normaliseRollModifier", () => {
    it("should return an identity RollModifier when input is null", () => {
      const result = normaliseRollModifier(null);
      expect(result).toBeInstanceOf(RollModifier);
      expect(result.apply(5)).toBe(5);
    });

    it("should return an identity RollModifier when input is undefined", () => {
      const result = normaliseRollModifier(undefined);
      expect(result).toBeInstanceOf(RollModifier);
      expect(result.apply(10)).toBe(10);
    });

    it("should return the same instance if input is already a RollModifier", () => {
      const rm = new RollModifier((n) => n * 2);
      const result = normaliseRollModifier(rm);
      expect(result).toBe(rm);
    });

    it("should wrap a valid function in a RollModifier", () => {
      const fn = (n) => n + 1;
      const result = normaliseRollModifier(fn);

      expect(result).toBeInstanceOf(RollModifier);
      expect(result.apply(3)).toBe(4);
    });

    it("should throw TypeError if input is not a RollModifier, function, or null/undefined", () => {
      expect(() => normaliseRollModifier(42)).toThrow(TypeError);
      expect(() => normaliseRollModifier("invalid")).toThrow(TypeError);
      expect(() => normaliseRollModifier({})).toThrow(TypeError);
    });
  });

  // ─────────────────────────────
  // isValidRollModifier()
  // ─────────────────────────────
  describe("isValidRollModifier", () => {
    it("returns false for null, undefined, or non-functions", () => {
      expect(isValidRollModifier(null)).toBe(false);
      expect(isValidRollModifier(undefined)).toBe(false);
      expect(isValidRollModifier(42)).toBe(false);
      expect(isValidRollModifier("string")).toBe(false);
      expect(isValidRollModifier({})).toBe(false);
      expect(isValidRollModifier([])).toBe(false);
    });

    it("returns false for functions with wrong number of parameters", () => {
      const f0 = () => 1;
      const f2 = (a, b) => 1;
      expect(isValidRollModifier(f0)).toBe(false);
      expect(isValidRollModifier(f2)).toBe(false);
    });

    it("returns false for functions that do not return an integer", () => {
      const f1 = (x) => "not a number";
      const f2 = (x) => 1.5;
      expect(isValidRollModifier(f1)).toBe(false);
      expect(isValidRollModifier(f2)).toBe(false);
    });

    it("returns true for valid integer-returning single-parameter functions", () => {
      const addOne = (x) => x + 1;
      const double = (x) => x * 2;
      expect(isValidRollModifier(addOne)).toBe(true);
      expect(isValidRollModifier(double)).toBe(true);
    });
  });
});
