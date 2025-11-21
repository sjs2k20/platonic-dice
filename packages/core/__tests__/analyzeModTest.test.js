/**
 * @jest-environment node
 */
const { analyseModTest } = require("../src/analyseModTest.js");
const { DieType } = require("../src/entities/DieType");
const { TestType } = require("../src/entities/TestType");
const { RollModifier } = require("../src/entities/RollModifier");
const { TestConditions } = require("../src/entities/TestConditions");
const { Outcome } = require("../src/entities/Outcome");

describe("analyseModTest", () => {
  describe("Basic Analysis with Modifiers", () => {
    test("analyses D20 with +5 modifier correctly", () => {
      const analysis = analyseModTest(DieType.D20, (n) => n + 5, {
        testType: TestType.AtLeast,
        target: 20,
      });

      expect(analysis.totalPossibilities).toBe(20);
      expect(analysis.modifiedRange).toEqual({ min: 6, max: 25 }); // 1+5 to 20+5
      // Rolls 15-20 will succeed (become 20-25)
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(6);
      expect(analysis.outcomeCounts[Outcome.Failure]).toBe(14);
    });

    test("analyses D20 with -3 modifier correctly", () => {
      const analysis = analyseModTest(DieType.D20, (n) => n - 3, {
        testType: TestType.AtLeast,
        target: 10,
      });

      expect(analysis.modifiedRange).toEqual({ min: -2, max: 17 }); // 1-3 to 20-3
      // Rolls 13-20 will succeed (become 10-17)
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(8);
      expect(analysis.rollsByOutcome[Outcome.Success]).toEqual([
        13, 14, 15, 16, 17, 18, 19, 20,
      ]);
    });

    test("analyses D6 with doubling modifier", () => {
      const analysis = analyseModTest(DieType.D6, (n) => n * 2, {
        testType: TestType.AtLeast,
        target: 8,
      });

      expect(analysis.modifiedRange).toEqual({ min: 2, max: 12 }); // 1*2 to 6*2
      // Rolls 4-6 will succeed (become 8-12)
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(3);
      expect(analysis.modifiedValuesByRoll[1]).toBe(2);
      expect(analysis.modifiedValuesByRoll[6]).toBe(12);
    });

    test("analyses D20 with multiplicative modifier correctly", () => {
      const analysis = analyseModTest(DieType.D20, (n) => Math.floor(n * 1.5), {
        testType: TestType.AtLeast,
        target: 25,
      });

      expect(analysis.totalPossibilities).toBe(20);
      // Roll 17 becomes 25 (17 * 1.5 = 25.5 → 25)
      expect(analysis.outcomeCounts[Outcome.Success]).toBeGreaterThan(0);
    });
  });

  describe("Natural Crits with Modifiers", () => {
    test("includes natural crits for Skill test when enabled", () => {
      const analysis = analyseModTest(
        DieType.D20,
        (n) => n + 5,
        { testType: TestType.Skill, target: 20 },
        { useNaturalCrits: true }
      );

      // Skill tests produce actual critical outcomes
      expect(analysis.outcomeCounts[Outcome.CriticalSuccess]).toBe(1); // Natural 20
      expect(analysis.outcomeCounts[Outcome.CriticalFailure]).toBe(1); // Natural 1
      expect(analysis.rollsByOutcome[Outcome.CriticalFailure]).toEqual([1]);
      expect(analysis.rollsByOutcome[Outcome.CriticalSuccess]).toEqual([20]);
    });

    test("natural crits for AtLeast do not produce critical outcomes", () => {
      const analysis = analyseModTest(
        DieType.D20,
        (n) => n + 15, // Large modifier
        { testType: TestType.AtLeast, target: 20 },
        { useNaturalCrits: true }
      );

      // AtLeast with natural crits just enforces natural max/min as success/failure
      // No critical outcomes
      expect(analysis.outcomeCounts[Outcome.CriticalSuccess]).toBeUndefined();
      expect(analysis.outcomeCounts[Outcome.CriticalFailure]).toBeUndefined();
      // Rolls 5-20 become 20-35 (success), but natural 1 stays failure, natural 20 stays success
      // So: 1=failure, 2-4=failure (17-19), 5-20=success (20-35)
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(16); // 5-20
      expect(analysis.outcomeCounts[Outcome.Failure]).toBe(4); // 1-4
    });

    test("defaults to natural crits for Skill test", () => {
      const analysis = analyseModTest(DieType.D20, (n) => n + 3, {
        testType: TestType.Skill,
        target: 15,
      });

      expect(analysis.outcomeCounts[Outcome.CriticalSuccess]).toBe(1);
      expect(analysis.outcomeCounts[Outcome.CriticalFailure]).toBe(1);
    });

    test("excludes natural crits when disabled", () => {
      const analysis = analyseModTest(
        DieType.D20,
        (n) => n + 3,
        { testType: TestType.AtLeast, target: 15 },
        { useNaturalCrits: false }
      );

      expect(analysis.outcomeCounts[Outcome.CriticalSuccess]).toBeUndefined();
      expect(analysis.outcomeCounts[Outcome.CriticalFailure]).toBeUndefined();
    });
  });

  describe("Edge Cases with Modifiers", () => {
    test("modifier makes impossible target possible", () => {
      const analysis = analyseModTest(DieType.D6, (n) => n + 10, {
        testType: TestType.AtLeast,
        target: 12,
      });

      // Without modifier: max roll is 6 (impossible)
      // With modifier: rolls 2-6 succeed (become 12-16)
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(5);
      expect(analysis.modifiedRange.max).toBe(16);
    });

    test("negative modifier makes easy target hard", () => {
      const analysis = analyseModTest(DieType.D20, (n) => n - 15, {
        testType: TestType.AtLeast,
        target: 5,
      });

      // Roll 20 becomes 5 (success), roll 19 becomes 4 (failure)
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(1);
      expect(analysis.rollsByOutcome[Outcome.Success]).toEqual([20]);
    });

    test("modifier that returns constant value", () => {
      const analysis = analyseModTest(
        DieType.D6,
        (n) => {
          n; // Use the parameter
          return 10;
        },
        { testType: TestType.AtLeast, target: 10 }
      );

      // All rolls become 10, all succeed
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(6);
      expect(analysis.modifiedRange).toEqual({ min: 10, max: 10 });
    });

    test("handles zero modifier", () => {
      const analysis = analyseModTest(DieType.D6, (n) => n + 0, {
        testType: TestType.AtLeast,
        target: 4,
      });

      expect(analysis.modifiedRange).toEqual({ min: 1, max: 6 });
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(3);
    });
  });

  describe("Input Formats", () => {
    test("accepts RollModifier instance", () => {
      const modifier = new RollModifier((n) => n + 5);
      const analysis = analyseModTest(DieType.D20, modifier, {
        testType: TestType.AtLeast,
        target: 20,
      });

      expect(analysis.outcomeCounts[Outcome.Success]).toBe(6);
    });

    test("accepts modifier function directly", () => {
      const analysis = analyseModTest(DieType.D20, (n) => n + 5, {
        testType: TestType.AtLeast,
        target: 20,
      });

      expect(analysis.outcomeCounts[Outcome.Success]).toBe(6);
    });

    test("accepts plain object for test conditions", () => {
      const analysis = analyseModTest(DieType.D20, (n) => n + 5, {
        testType: TestType.AtLeast,
        target: 15,
      });

      expect(analysis.totalPossibilities).toBe(20);
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(11); // 10-20 succeed
    });
  });

  describe("Output Structure", () => {
    test("provides complete analysis structure", () => {
      const analysis = analyseModTest(DieType.D6, (n) => n + 2, {
        testType: TestType.AtLeast,
        target: 5,
      });

      expect(analysis).toHaveProperty("totalPossibilities");
      expect(analysis).toHaveProperty("outcomeCounts");
      expect(analysis).toHaveProperty("outcomeProbabilities");
      expect(analysis).toHaveProperty("outcomesByRoll");
      expect(analysis).toHaveProperty("modifiedValuesByRoll");
      expect(analysis).toHaveProperty("rolls");
      expect(analysis).toHaveProperty("rollsByOutcome");
      expect(analysis).toHaveProperty("modifiedRange");
    });

    test("modifiedValuesByRoll maps each roll to modified value", () => {
      const analysis = analyseModTest(DieType.D6, (n) => n * 3, {
        testType: TestType.AtLeast,
        target: 10,
      });

      expect(analysis.modifiedValuesByRoll[1]).toBe(3);
      expect(analysis.modifiedValuesByRoll[4]).toBe(12);
      expect(analysis.modifiedValuesByRoll[6]).toBe(18);
    });

    test("modifiedRange shows achievable value range", () => {
      const analysis = analyseModTest(DieType.D8, (n) => n + 5, {
        testType: TestType.AtLeast,
        target: 10,
      });

      expect(analysis.modifiedRange.min).toBe(6); // 1+5
      expect(analysis.modifiedRange.max).toBe(13); // 8+5
    });

    test("probabilities sum to 1", () => {
      const analysis = analyseModTest(DieType.D20, (n) => n + 3, {
        testType: TestType.AtLeast,
        target: 15,
      });

      const totalProbability = Object.values(
        analysis.outcomeProbabilities
      ).reduce((sum, prob) => sum + prob, 0);
      expect(totalProbability).toBeCloseTo(1);
    });
  });

  describe("Complex Modifiers", () => {
    test("analyses min-max clamping modifier", () => {
      const clamp = (n) => Math.max(5, Math.min(n + 2, 15));
      const analysis = analyseModTest(DieType.D20, clamp, {
        testType: TestType.AtLeast,
        target: 10,
      });

      // Roll 1-3 → 5, Roll 4-13 → 6-15, Roll 14-20 → 15
      expect(analysis.modifiedRange.min).toBe(5);
      expect(analysis.modifiedRange.max).toBe(15);
    });

    test("analyses conditional modifier", () => {
      const conditional = (n) => (n >= 10 ? n + 5 : n);
      const analysis = analyseModTest(DieType.D20, conditional, {
        testType: TestType.AtLeast,
        target: 15,
      });

      // Rolls 1-9: no modifier (all fail)
      // Rolls 10-14: +5 modifier (become 15-19, succeed)
      // Rolls 15-20: +5 modifier (become 20-25, succeed)
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(11); // 10-20
    });

    test("analyses dice-exploding-style modifier", () => {
      const explode = (n) => (n === 6 ? n + 6 : n);
      const analysis = analyseModTest(DieType.D6, explode, {
        testType: TestType.AtLeast,
        target: 10,
      });

      // Only roll 6 succeeds (becomes 12)
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(1);
      expect(analysis.modifiedValuesByRoll[6]).toBe(12);
      expect(analysis.modifiedRange.max).toBe(12);
    });
  });

  describe("Different Test Types with Modifiers", () => {
    test("analyses AtMost test with modifier", () => {
      const analysis = analyseModTest(DieType.D6, (n) => n - 1, {
        testType: TestType.AtMost,
        target: 3,
      });

      // Rolls 1-4 become 0-3 (succeed)
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(4);
      expect(analysis.modifiedRange).toEqual({ min: 0, max: 5 });
    });

    test("analyses Within test with modifier", () => {
      const analysis = analyseModTest(DieType.D20, (n) => n + 10, {
        testType: TestType.Within,
        min: 20,
        max: 25,
      });

      // Rolls 10-15 become 20-25 (succeed)
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(6);
    });

    test("analyses Exact test with modifier", () => {
      const analysis = analyseModTest(DieType.D10, (n) => n * 2, {
        testType: TestType.Exact,
        target: 10,
      });

      // Only roll 5 becomes 10 (succeeds)
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(1);
      expect(analysis.rollsByOutcome[Outcome.Success]).toEqual([5]);
    });
  });

  describe("Different Die Types with Modifiers", () => {
    test("analyses D4 with modifier", () => {
      const analysis = analyseModTest(DieType.D4, (n) => n + 10, {
        testType: TestType.AtLeast,
        target: 12,
      });

      expect(analysis.totalPossibilities).toBe(4);
      expect(analysis.modifiedRange).toEqual({ min: 11, max: 14 });
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(3); // Rolls 2-4
    });

    test("analyses D12 with modifier", () => {
      const analysis = analyseModTest(DieType.D12, (n) => n * 2, {
        testType: TestType.AtLeast,
        target: 20,
      });

      expect(analysis.totalPossibilities).toBe(12);
      expect(analysis.modifiedRange.max).toBe(24); // 12 * 2
      expect(analysis.outcomeCounts[Outcome.Success]).toBe(3); // Rolls 10-12 become 20-24
    });
  });
});
