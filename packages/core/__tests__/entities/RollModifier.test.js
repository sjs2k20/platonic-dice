const { RollModifier } = require("../../src/entities/RollModifier.js");
const { isRollModifier } = require("../../src/validators");

jest.mock("../../src/validators", () => ({
  isRollModifier: jest.fn(),
}));

describe("@dice/core/entities/RollModifier", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────
  // Constructor
  // ─────────────────────────────
  describe("constructor", () => {
    it("should create an instance when a valid modifier function is provided", () => {
      const mockFn = jest.fn((n) => n + 2);
      isRollModifier.mockReturnValue(true);

      const modifier = new RollModifier(mockFn);

      expect(modifier).toBeInstanceOf(RollModifier);
      expect(modifier.fn).toBe(mockFn);
      expect(isRollModifier).toHaveBeenCalledWith(mockFn);
    });

    it("should throw a TypeError if the function is invalid", () => {
      const invalidFn = "not-a-function";
      isRollModifier.mockReturnValue(false);

      expect(() => new RollModifier(invalidFn)).toThrow(TypeError);
      expect(() => new RollModifier(invalidFn)).toThrow(
        /Invalid roll modifier/
      );
      expect(isRollModifier).toHaveBeenCalledWith(invalidFn);
    });

    it("should store the function reference exactly as provided", () => {
      const fn = (x) => x * 2;
      isRollModifier.mockReturnValue(true);
      const mod = new RollModifier(fn);
      expect(mod.fn).toBe(fn);
    });
  });

  // ─────────────────────────────
  // apply()
  // ─────────────────────────────
  describe("apply", () => {
    it("should apply the stored modifier function to a base value", () => {
      const mockFn = jest.fn((n) => n + 3);
      isRollModifier.mockReturnValue(true);
      const modifier = new RollModifier(mockFn);

      const result = modifier.apply(5);

      expect(mockFn).toHaveBeenCalledWith(5);
      expect(result).toBe(8);
    });

    it("should return the function’s result directly", () => {
      const mockFn = jest.fn((n) => n - 1);
      isRollModifier.mockReturnValue(true);
      const modifier = new RollModifier(mockFn);

      expect(modifier.apply(10)).toBe(9);
      expect(modifier.apply(0)).toBe(-1);
    });

    it("should propagate errors thrown by the modifier function", () => {
      const mockFn = jest.fn(() => {
        throw new Error("Boom!");
      });
      isRollModifier.mockReturnValue(true);
      const modifier = new RollModifier(mockFn);

      expect(() => modifier.apply(7)).toThrow("Boom!");
    });
  });

  // ─────────────────────────────
  // validate()
  // ─────────────────────────────
  describe("validate", () => {
    it("should not throw if the function is still valid", () => {
      const mockFn = (n) => n * 2;
      isRollModifier.mockReturnValue(true);
      const modifier = new RollModifier(mockFn);

      // Validate again
      modifier.validate();

      expect(isRollModifier).toHaveBeenLastCalledWith(mockFn);
    });

    it("should throw a TypeError if the stored fn becomes invalid", () => {
      const mockFn = (n) => n + 1;
      isRollModifier.mockReturnValueOnce(true).mockReturnValueOnce(false);

      const modifier = new RollModifier(mockFn);

      try {
        modifier.validate();
      } catch (err) {
        expect(err).toBeInstanceOf(TypeError);
        expect(err.message).toMatch(/Invalid roll modifier function shape/);
      }

      expect(isRollModifier).toHaveBeenCalledTimes(2);
    });
  });

  // ─────────────────────────────
  // Integration Behavior
  // ─────────────────────────────
  describe("integration behavior", () => {
    it("should work as expected with the identity modifier", () => {
      const identity = (n) => n;
      isRollModifier.mockReturnValue(true);
      const mod = new RollModifier(identity);

      expect(mod.apply(5)).toBe(5);
      expect(mod.apply(0)).toBe(0);
    });

    it("should work correctly when chained manually", () => {
      const add2 = (n) => n + 2;
      const double = (n) => n * 2;
      isRollModifier.mockReturnValue(true);
      const mod1 = new RollModifier(add2);
      const mod2 = new RollModifier(double);

      const base = 4;
      const result = mod2.apply(mod1.apply(base));

      expect(result).toBe(12); // (4 + 2) * 2 = 12
    });
  });
});
