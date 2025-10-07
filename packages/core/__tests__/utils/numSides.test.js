const { isDieType } = require("../../src/validators");
const { numSides } = require("../../src/utils");

// Mock isDieType to control validation behavior
jest.mock("../../src/validators", () => ({
  isDieType: jest.fn(),
}));

describe("numSides", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("input validation", () => {
    it("throws if dieType is invalid", () => {
      isDieType.mockReturnValue(false);
      expect(() => numSides("dInvalid")).toThrow(TypeError);
      expect(() => numSides("dInvalid")).toThrow(
        "Cannot parse the number of sides: Invalid die type - dInvalid"
      );
    });

    it("does not throw if dieType is valid", () => {
      isDieType.mockReturnValue(true);
      expect(() => numSides("d6")).not.toThrow();
    });
  });

  describe("returns correct number of sides", () => {
    it("parses dieType string correctly", () => {
      isDieType.mockReturnValue(true);

      const tests = [
        ["d1", 1],
        ["d4", 4],
        ["d6", 6],
        ["d8", 8],
        ["d10", 10],
        ["d12", 12],
        ["d20", 20],
        ["d100", 100],
      ];

      for (const [dieType, expected] of tests) {
        expect(numSides(dieType)).toBe(expected);
      }
    });

    it("returns an integer", () => {
      isDieType.mockReturnValue(true);
      const result = numSides("d20");
      expect(Number.isInteger(result)).toBe(true);
    });
  });
});
