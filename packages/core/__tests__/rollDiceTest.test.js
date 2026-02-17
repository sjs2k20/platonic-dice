"use strict";

const { DieType, TestType, Outcome } = require("../src/entities");
const rollDiceTestModule = require("../src/rollDiceTest");
const rollUtils = require("../src/roll");

describe("@platonic-dice/core/rollDiceTest", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("validation", () => {
    it("should throw a TypeError for invalid die types", () => {
      expect(() =>
        rollDiceTestModule.rollDiceTest("invalid", [
          { testType: TestType.AtLeast, target: 1 },
        ]),
      ).toThrow(TypeError);
    });

    it("should throw a TypeError if count is not a positive integer", () => {
      expect(() =>
        rollDiceTestModule.rollDiceTest(
          DieType.D6,
          [{ testType: TestType.AtLeast, target: 1 }],
          { count: 0 },
        ),
      ).toThrow(TypeError);

      expect(() =>
        rollDiceTestModule.rollDiceTest(
          DieType.D6,
          [{ testType: TestType.AtLeast, target: 1 }],
          { count: -1 },
        ),
      ).toThrow(TypeError);
    });
  });

  describe("evaluation", () => {
    it("evaluates multiple dice against multiple conditions and returns matrix/counts", () => {
      jest
        .spyOn(rollUtils, "roll")
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(6);

      const res = rollDiceTestModule.rollDiceTest(
        DieType.D6,
        [
          { testType: TestType.AtLeast, target: 3 },
          { testType: TestType.AtLeast, target: 5 },
        ],
        { count: 2 },
      );

      expect(res.base.array).toEqual([4, 6]);
      expect(res.base.sum).toBe(10);

      // matrix: per-die -> per-condition
      expect(res.result.matrix).toEqual([
        [Outcome.Success, Outcome.Failure],
        [Outcome.Success, Outcome.Success],
      ]);

      expect(res.result.condCount[0]).toBe(2);
      expect(res.result.condCount[1]).toBe(1);
      expect(res.result.ruleResults.length).toBe(0);
      expect(res.result.passed).toBe(true);
    });

    it("applies rules and reports pass/fail correctly", () => {
      jest
        .spyOn(rollUtils, "roll")
        .mockReturnValueOnce(6)
        .mockReturnValueOnce(6)
        .mockReturnValueOnce(1);

      const res = rollDiceTestModule.rollDiceTest(
        DieType.D6,
        [{ testType: TestType.Exact, target: 6 }],
        { count: 3, rules: [{ type: "value_count", value: 6, atLeast: 2 }] },
      );

      expect(res.base.array).toEqual([6, 6, 1]);
      expect(res.result.valueCounts[6]).toBe(2);
      expect(res.result.ruleResults[0].passed).toBe(true);
      expect(res.result.passed).toBe(true);
    });
  });
});
