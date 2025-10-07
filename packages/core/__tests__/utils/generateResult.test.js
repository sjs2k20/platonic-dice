const { generateDieResult, numSides } = require("../../src/utils");

// Mock numSides to control output for testing
jest.mock("../../src/utils/numSides", () => ({
  numSides: jest.fn(),
}));

describe("generateDieResult", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("input validation", () => {
    it("throws if dieType is invalid", () => {
      numSides.mockImplementation(() => {
        throw new TypeError("Invalid dieType");
      });
      expect(() => generateDieResult("dInvalid")).toThrow(TypeError);
      expect(() => generateDieResult("dInvalid")).toThrow("Invalid dieType");
    });
  });

  describe("result generation", () => {
    it("calls numSides with the provided dieType", () => {
      numSides.mockReturnValue(6);
      generateDieResult("d6");
      expect(numSides).toHaveBeenCalledWith("d6");
    });

    it("returns a number between 1 and the number of sides", () => {
      const sides = 20;
      numSides.mockReturnValue(sides);

      for (let i = 0; i < 100; i++) {
        // run multiple times to cover random range
        const result = generateDieResult("d20");
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(sides);
      }
    });

    it("returns an integer", () => {
      numSides.mockReturnValue(12);
      for (let i = 0; i < 50; i++) {
        const result = generateDieResult("d12");
        expect(Number.isInteger(result)).toBe(true);
      }
    });
  });

  describe("edge cases", () => {
    it("works for 1-sided die", () => {
      numSides.mockReturnValue(1);
      expect(generateDieResult("d1")).toBe(1);
    });
  });
});
