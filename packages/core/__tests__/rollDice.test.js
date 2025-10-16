"use strict";

const { DieType } = require("../src/entities");
const rollModule = require("../src/rollDice");
const rollUtils = require("../src/roll");

describe("@platonic-dice/core/rollDice", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("validation", () => {
    it("should throw a TypeError for invalid die types", () => {
      expect(() => rollModule.rollDice("invalid")).toThrow(TypeError);
    });

    it("should throw a TypeError if count is not a positive integer", () => {
      expect(() => rollModule.rollDice(DieType.D6, { count: 0 })).toThrow(
        TypeError
      );
      expect(() => rollModule.rollDice(DieType.D6, { count: -1 })).toThrow(
        TypeError
      );
      expect(() => rollModule.rollDice(DieType.D6, { count: 1.5 })).toThrow(
        TypeError
      );
      expect(() => rollModule.rollDice(DieType.D6, { count: "two" })).toThrow(
        TypeError
      );
    });
  });

  describe("core rollDice functionality", () => {
    it("should return a single roll by default", () => {
      jest.spyOn(rollUtils, "roll").mockReturnValue(4);
      const result = rollModule.rollDice(DieType.D6);
      expect(result.array).toEqual([4]);
      expect(result.sum).toBe(4);
    });

    it("should return multiple rolls with correct sum", () => {
      const mockValues = [1, 2, 3];
      let callIndex = 0;
      jest
        .spyOn(rollUtils, "roll")
        .mockImplementation(() => mockValues[callIndex++]);
      const result = rollModule.rollDice(DieType.D6, { count: 3 });
      expect(result.array).toEqual([1, 2, 3]);
      expect(result.sum).toBe(6);
    });
  });

  describe("aliases", () => {
    it("roll2x should roll exactly 2 dice", () => {
      jest
        .spyOn(rollUtils, "roll")
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(5);
      const result = rollModule.roll2x(DieType.D6);
      expect(result.array).toEqual([3, 5]);
      expect(result.sum).toBe(8);
    });

    it("roll3x should roll exactly 3 dice", () => {
      jest
        .spyOn(rollUtils, "roll")
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(6);
      const result = rollModule.roll3x(DieType.D6);
      expect(result.array).toEqual([2, 4, 6]);
      expect(result.sum).toBe(12);
    });

    it("roll100x should roll exactly 100 dice (mocked for deterministic check)", () => {
      const mockRolls = Array(100).fill(1);
      let callIndex = 0;
      jest
        .spyOn(rollUtils, "roll")
        .mockImplementation(() => mockRolls[callIndex++]);
      const result = rollModule.roll100x(DieType.D6);
      expect(result.array.length).toBe(100);
      expect(result.sum).toBe(100);
    });
  });
});
