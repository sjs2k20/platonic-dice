const { RollModifier } = require("../../../src/entities");
const {
  normaliseRollModifier,
} = require("../../../src/entities/normalisation");
const { isRollModifier } = require("../../../src/validators");

jest.mock("../../../src/validators", () => ({
  isRollModifier: jest.fn(),
}));

describe("@dice/core/entities/normalisation/normaliseRollModifier", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default behaviour: any function is a valid RollModifier
    isRollModifier.mockImplementation((fn) => typeof fn === "function");
  });

  describe("normaliseRollModifier", () => {
    it("should return an identity RollModifier when input is null", () => {
      const result = normaliseRollModifier(null);
      expect(result).toBeInstanceOf(RollModifier);
      expect(result.apply(5)).toBe(5); // identity function
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
      isRollModifier.mockReturnValue(true);

      const result = normaliseRollModifier(fn);
      expect(result).toBeInstanceOf(RollModifier);
      expect(result.apply(3)).toBe(4);
      expect(isRollModifier).toHaveBeenCalledWith(fn);
    });

    it("should throw TypeError if input is not a RollModifier, function, or null/undefined", () => {
      expect(() => normaliseRollModifier(42)).toThrow(TypeError);
      expect(() => normaliseRollModifier("invalid")).toThrow(TypeError);

      // Function that fails isRollModifier check
      const fn = () => {};
      isRollModifier.mockReturnValue(false);
      expect(() => normaliseRollModifier(fn)).toThrow(TypeError);
    });
  });
});
