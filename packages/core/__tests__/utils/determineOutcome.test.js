"use strict";

/**
 * @file
 * @module @dice/core/__tests__/utils/determineOutcome.test.js
 * @description
 * Comprehensive test suite for the `determineOutcome` utility.
 * Covers validation, behaviour across all supported TestTypes,
 * and critical success/failure edge cases.
 */

const { determineOutcome } = require("../../src/utils/determineOutcome");
const {
  Outcome,
  TestType,
  TestConditions,
  DieType,
} = require("../../src/entities");

describe("@dice/core/utils/determineOutcome", () => {
  describe("validation", () => {
    it("should throw a TypeError if value is not a number", () => {
      expect(() => determineOutcome("not-a-number", {})).toThrow(TypeError);
      expect(() => determineOutcome(NaN, {})).toThrow(
        "value must be a valid number."
      );
    });

    it("should throw a TypeError if testType is unsupported", () => {
      const badConditions = {
        testType: "unknown_type",
        target: 5,
        dieType: DieType.D6,
      };
      expect(() => determineOutcome(5, badConditions)).toThrow(
        "Invalid test type: unknown_type"
      );
    });

    it("should normalise plain object input into a TestConditions instance", () => {
      const input = {
        testType: TestType.AtLeast,
        dieType: DieType.D6,
        target: 4,
      };
      const outcome = determineOutcome(5, input);
      expect(outcome).toBe(Outcome.Success);
    });
  });

  describe("TestType.AtLeast", () => {
    const test = new TestConditions(
      TestType.AtLeast,
      { target: 10 },
      DieType.D20
    );

    it("should return Success when value >= target", () => {
      expect(determineOutcome(10, test)).toBe(Outcome.Success);
      expect(determineOutcome(15, test)).toBe(Outcome.Success);
    });

    it("should return Failure when value < target", () => {
      expect(determineOutcome(9, test)).toBe(Outcome.Failure);
    });
  });

  describe("TestType.AtMost", () => {
    const test = new TestConditions(
      TestType.AtMost,
      { target: 5 },
      DieType.D10
    );

    it("should return Success when value <= target", () => {
      expect(determineOutcome(4, test)).toBe(Outcome.Success);
      expect(determineOutcome(5, test)).toBe(Outcome.Success);
    });

    it("should return Failure when value > target", () => {
      expect(determineOutcome(6, test)).toBe(Outcome.Failure);
    });
  });

  describe("TestType.Exact", () => {
    const test = new TestConditions(TestType.Exact, { target: 3 }, DieType.D6);

    it("should return Success when value === target", () => {
      expect(determineOutcome(3, test)).toBe(Outcome.Success);
    });

    it("should return Failure otherwise", () => {
      expect(determineOutcome(4, test)).toBe(Outcome.Failure);
    });
  });

  describe("TestType.Within", () => {
    const test = new TestConditions(
      TestType.Within,
      { min: 3, max: 7 },
      DieType.D10
    );

    it("should return Success when value is within range", () => {
      expect(determineOutcome(5, test)).toBe(Outcome.Success);
    });

    it("should return Failure when below or above range", () => {
      expect(determineOutcome(2, test)).toBe(Outcome.Failure);
      expect(determineOutcome(8, test)).toBe(Outcome.Failure);
    });
  });

  describe("TestType.InList", () => {
    const test = new TestConditions(
      TestType.InList,
      { values: [2, 4, 6] },
      DieType.D8
    );

    it("should return Success when value is in list", () => {
      expect(determineOutcome(4, test)).toBe(Outcome.Success);
    });

    it("should return Failure when value is not in list", () => {
      expect(determineOutcome(5, test)).toBe(Outcome.Failure);
    });

    it("should throw a RangeError if 'values' is invalid", () => {
      expect(
        () => new TestConditions(TestType.InList, { values: null }, DieType.D8)
      ).toThrow(RangeError);
    });
  });

  describe("TestType.Skill", () => {
    const test = new TestConditions(
      TestType.Skill,
      {
        target: 10,
        critical_success: 20,
        critical_failure: 1,
      },
      DieType.D20
    );

    it("should return CriticalFailure when value <= critical_failure", () => {
      expect(determineOutcome(1, test)).toBe(Outcome.CriticalFailure);
    });

    it("should return CriticalSuccess when value >= critical_success", () => {
      expect(determineOutcome(20, test)).toBe(Outcome.CriticalSuccess);
    });

    it("should return Success when value >= target but < critical_success", () => {
      expect(determineOutcome(15, test)).toBe(Outcome.Success);
    });

    it("should return Failure when value < target and > critical_failure", () => {
      expect(determineOutcome(5, test)).toBe(Outcome.Failure);
    });

    it("should handle missing critical thresholds safely", () => {
      const simple = new TestConditions(
        TestType.Skill,
        { target: 10 },
        DieType.D20
      );
      expect(determineOutcome(9, simple)).toBe(Outcome.Failure);
      expect(determineOutcome(10, simple)).toBe(Outcome.Success);
    });
  });

  describe("integration and edge cases", () => {
    it("should work consistently when receiving TestConditions instance or plain object", () => {
      const tc = new TestConditions(
        TestType.AtLeast,
        { target: 10 },
        DieType.D20
      );
      const po = {
        testType: TestType.AtLeast,
        dieType: DieType.D20,
        target: 10,
      };

      expect(determineOutcome(10, tc)).toBe(determineOutcome(10, po));
      expect(determineOutcome(5, tc)).toBe(determineOutcome(5, po));
    });

    it("should throw clear error for unsupported testType", () => {
      const custom = { testType: "foobar", dieType: DieType.D20, target: 5 };
      expect(() => determineOutcome(5, custom)).toThrow(
        "Invalid test type: foobar"
      );
    });
  });
});
