/**
 * @jest-environment node
 */
const { analyseTest } = require("../src/analyseTest.js");
const { DieType } = require("../src/entities/DieType");
const { TestType } = require("../src/entities/TestType");
const { TestConditions } = require("../src/entities/TestConditions");
const { Outcome } = require("../src/entities/Outcome");

describe("analyseTest", () => {
  describe("Basic Analysis", () => {
    test("analyses D20 AtLeast test correctly", () => {
      const analysis = analyseTest(DieType.D20, {
        testType: TestType.AtLeast,
        target: 15,
      });

      expect(analysis.totalPossibilities).toBe(20);
      expect(analysis.rolls).toEqual(
        Array.from({ length: 20 }, (_, i) => i + 1)
      );
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(6); // 15-20
      expect(analysis.outcomeCounts[Outcome.Failure]).toBe(14); // 1-14
      expect(analysis.outcomeProbabilities[Outcome.Success]).toBeCloseTo(0.3);
      expect(analysis.outcomeProbabilities[Outcome.Failure]).toBeCloseTo(0.7);
    });

    test("analyses D6 AtMost test correctly", () => {
      const analysis = analyseTest(DieType.D6, {
        testType: TestType.AtMost,
        target: 3,
      });

      expect(analysis.totalPossibilities).toBe(6);
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(3); // 1-3
      expect(analysis.outcomeCounts[Outcome.Failure]).toBe(3); // 4-6
      expect(analysis.outcomeProbabilities[Outcome.Success]).toBeCloseTo(0.5);
    });

    test("analyses D20 Within test correctly", () => {
      const analysis = analyseTest(DieType.D20, {
        testType: TestType.Within,
        min: 8,
        max: 12,
      });

      expect(analysis.totalPossibilities).toBe(20);
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(5); // 8-12 inclusive
      expect(analysis.outcomeCounts[Outcome.Failure]).toBe(15);
      expect(analysis.outcomeProbabilities[Outcome.Success]).toBeCloseTo(0.25);
    });

    test("analyses Exact test correctly", () => {
      const analysis = analyseTest(DieType.D10, {
        testType: TestType.Exact,
        target: 7,
      });

      expect(analysis.totalPossibilities).toBe(10);
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(1);
      expect(analysis.outcomeCounts[Outcome.Failure]).toBe(9);
      expect(analysis.outcomeProbabilities[Outcome.Success]).toBeCloseTo(0.1);
      expect(analysis.rollsByOutcome[Outcome.Success]).toEqual([7]);
    });
  });

  describe("Natural Crits", () => {
    test("includes natural crits for AtLeast test when enabled", () => {
      const analysis = analyseTest(
        DieType.D20,
        { testType: TestType.AtLeast, target: 15 },
        { useNaturalCrits: true }
      );

      // For AtLeast with useNaturalCrits, natural max=success, natural min=failure
      // NOT critical outcomes (those are only for Skill test type)
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(6); // 15-20
      expect(analysis.outcomeCounts[Outcome.Failure]).toBe(14); // 1-14
      expect(analysis.outcomeCounts[Outcome.CriticalSuccess]).toBeUndefined();
      expect(analysis.outcomeCounts[Outcome.CriticalFailure]).toBeUndefined();
    });

    test("excludes natural crits when disabled", () => {
      const analysis = analyseTest(
        DieType.D20,
        { testType: TestType.AtLeast, target: 15 },
        { useNaturalCrits: false }
      );

      expect(analysis.outcomeCounts[Outcome.CriticalSuccess]).toBeUndefined();
      expect(analysis.outcomeCounts[Outcome.CriticalFailure]).toBeUndefined();
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(6); // 15-20
      expect(analysis.outcomeCounts[Outcome.Failure]).toBe(14); // 1-14
    });

    test("defaults to natural crits for Skill test type", () => {
      const analysis = analyseTest(DieType.D20, {
        testType: TestType.Skill,
        target: 15,
      });

      // Skill tests produce actual critical outcomes
      expect(analysis.outcomeCounts[Outcome.CriticalSuccess]).toBe(1);
      expect(analysis.outcomeCounts[Outcome.CriticalFailure]).toBe(1);
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(5); // 15-19
      expect(analysis.outcomeCounts[Outcome.Failure]).toBe(13); // 2-14
    });

    test("defaults to no natural crits for non-Skill test types", () => {
      const analysis = analyseTest(DieType.D20, {
        testType: TestType.AtLeast,
        target: 15,
      });

      expect(analysis.outcomeCounts[Outcome.CriticalSuccess]).toBeUndefined();
      expect(analysis.outcomeCounts[Outcome.CriticalFailure]).toBeUndefined();
    });
  });

  describe("Edge Cases", () => {
    test("handles very difficult target", () => {
      const analysis = analyseTest(DieType.D20, {
        testType: TestType.AtLeast,
        target: 20,
      });

      expect(analysis.outcomeCounts[Outcome.Success]).toBe(1);
      expect(analysis.outcomeCounts[Outcome.Failure]).toBe(19);
      expect(analysis.outcomeProbabilities[Outcome.Success]).toBeCloseTo(0.05);
      expect(analysis.outcomeProbabilities[Outcome.Failure]).toBeCloseTo(0.95);
    });

    test("handles guaranteed success condition", () => {
      const analysis = analyseTest(DieType.D6, {
        testType: TestType.AtLeast,
        target: 1,
      });

      expect(analysis.outcomeCounts[Outcome.Success]).toBe(6);
      expect(analysis.outcomeCounts[Outcome.Failure] || 0).toBe(0);
      expect(analysis.outcomeProbabilities[Outcome.Success]).toBe(1);
    });

    test("handles range that covers entire die", () => {
      const analysis = analyseTest(DieType.D8, {
        testType: TestType.Within,
        min: 1,
        max: 8,
      });

      expect(analysis.outcomeCounts[Outcome.Success]).toBe(8);
      expect(analysis.outcomeCounts[Outcome.Failure] || 0).toBe(0);
    });

    test("handles narrow range", () => {
      const analysis = analyseTest(DieType.D20, {
        testType: TestType.Within,
        min: 10,
        max: 12,
      });

      expect(analysis.outcomeCounts[Outcome.Success]).toBe(3); // 10, 11, 12
      expect(analysis.outcomeCounts[Outcome.Failure]).toBe(17);
    });
  });

  describe("Input Formats", () => {
    test("accepts TestConditions instance", () => {
      const testConditions = new TestConditions(
        TestType.AtLeast,
        { target: 12 },
        DieType.D20
      );
      const analysis = analyseTest(DieType.D20, testConditions);

      expect(analysis.totalPossibilities).toBe(20);
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(9); // 12-20
    });

    test("accepts plain object", () => {
      const analysis = analyseTest(DieType.D20, {
        testType: TestType.AtLeast,
        target: 12,
      });

      expect(analysis.totalPossibilities).toBe(20);
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(9); // 12-20
    });
  });

  describe("Output Structure", () => {
    test("provides complete analysis structure", () => {
      const analysis = analyseTest(DieType.D6, {
        testType: TestType.AtLeast,
        target: 4,
      });

      expect(analysis).toHaveProperty("totalPossibilities");
      expect(analysis).toHaveProperty("outcomeCounts");
      expect(analysis).toHaveProperty("outcomeProbabilities");
      expect(analysis).toHaveProperty("outcomesByRoll");
      expect(analysis).toHaveProperty("rolls");
      expect(analysis).toHaveProperty("rollsByOutcome");
    });

    test("outcomesByRoll maps each roll to outcome", () => {
      const analysis = analyseTest(DieType.D6, {
        testType: TestType.AtLeast,
        target: 4,
      });

      expect(analysis.outcomesByRoll[1]).toBe(Outcome.Failure);
      expect(analysis.outcomesByRoll[4]).toBe(Outcome.Success);
      expect(analysis.outcomesByRoll[6]).toBe(Outcome.Success);
    });

    test("rollsByOutcome groups rolls by their outcome", () => {
      const analysis = analyseTest(DieType.D6, {
        testType: TestType.AtLeast,
        target: 4,
      });

      expect(analysis.rollsByOutcome[Outcome.Success]).toEqual([4, 5, 6]);
      expect(analysis.rollsByOutcome[Outcome.Failure]).toEqual([1, 2, 3]);
    });

    test("probabilities sum to 1", () => {
      const analysis = analyseTest(DieType.D20, {
        testType: TestType.AtLeast,
        target: 11,
      });

      const totalProbability = Object.values(
        analysis.outcomeProbabilities
      ).reduce((sum, prob) => sum + prob, 0);
      expect(totalProbability).toBeCloseTo(1);
    });
  });

  describe("Different Die Types", () => {
    test("analyses D4 correctly", () => {
      const analysis = analyseTest(DieType.D4, {
        testType: TestType.AtLeast,
        target: 3,
      });

      expect(analysis.totalPossibilities).toBe(4);
      expect(analysis.rolls).toEqual([1, 2, 3, 4]);
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(2); // 3-4
    });

    test("analyses D12 correctly", () => {
      const analysis = analyseTest(DieType.D12, {
        testType: TestType.Exact,
        target: 7,
      });

      expect(analysis.totalPossibilities).toBe(12);
      expect(analysis.outcomeProbabilities[Outcome.Success]).toBeCloseTo(
        1 / 12
      );
    });

    test("analyses D10 correctly", () => {
      const analysis = analyseTest(DieType.D10, {
        testType: TestType.AtLeast,
        target: 8,
      });

      expect(analysis.totalPossibilities).toBe(10);
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(3); // 8-10
      expect(analysis.outcomeProbabilities[Outcome.Success]).toBeCloseTo(0.3);
    });
  });
});
