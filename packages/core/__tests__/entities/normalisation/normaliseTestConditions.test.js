const { TestConditions } = require("../../../src/entities");
const {
  normaliseTestConditions,
} = require("../../../src/entities/normalisation");

jest.mock("../../../src/entities", () => ({
  TestConditions: jest.fn(),
}));

describe("@dice/core/entities/normalisation/normaliseTestConditions", () => {
  const mockDieType = "d6";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("normaliseTestConditions", () => {
    it("should return the same instance if input is already a TestConditions instance", () => {
      const instance = new (class extends Object {})(); // fake instance
      Object.setPrototypeOf(instance, TestConditions.prototype);

      const result = normaliseTestConditions(instance, mockDieType);

      expect(result).toBe(instance);
      expect(TestConditions).not.toHaveBeenCalled();
    });

    it("should create a new TestConditions instance from a plain object", () => {
      const mockObject = { testType: "atLeast", target: 4 };
      const mockInstance = { isMockInstance: true };
      TestConditions.mockImplementation(() => mockInstance);

      const result = normaliseTestConditions(mockObject, mockDieType);

      expect(TestConditions).toHaveBeenCalledWith(
        "atLeast",
        { target: 4 },
        mockDieType
      );
      expect(result).toBe(mockInstance);
    });

    it("should pass through additional fields when creating new TestConditions", () => {
      const mockObject = {
        testType: "exact",
        target: 3,
        bonus: 2,
        difficulty: "hard",
      };
      const mockInstance = { fromPlain: true };
      TestConditions.mockImplementation(() => mockInstance);

      const result = normaliseTestConditions(mockObject, mockDieType);

      expect(TestConditions).toHaveBeenCalledWith(
        "exact",
        { target: 3, bonus: 2, difficulty: "hard" },
        mockDieType
      );
      expect(result).toBe(mockInstance);
    });

    it("should throw a TypeError if input is not a TestConditions instance or object", () => {
      expect(() => normaliseTestConditions(null, mockDieType)).toThrow(
        TypeError
      );
      expect(() => normaliseTestConditions(undefined, mockDieType)).toThrow(
        TypeError
      );
      expect(() => normaliseTestConditions(123, mockDieType)).toThrow(
        TypeError
      );
      expect(() => normaliseTestConditions("invalid", mockDieType)).toThrow(
        TypeError
      );
      expect(() => normaliseTestConditions(() => {}, mockDieType)).toThrow(
        TypeError
      );
    });

    it("should include the correct error message when input is invalid", () => {
      try {
        normaliseTestConditions("not-valid", mockDieType);
      } catch (err) {
        expect(err.message).toMatch(/Invalid TestConditions/);
      }
    });
  });
});
