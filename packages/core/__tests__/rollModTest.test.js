/**
 * @jest-environment node
 */

const { rollModTest } = require("../src/rollModTest.js");
const {
  DieType,
  RollType,
  RollModifier,
  TestType,
  TestConditions,
  Outcome,
} = require("../src/entities");

describe("rollModTest", () => {
  describe("basic functionality", () => {
    it("should return base, modified, and outcome properties", () => {
      const result = rollModTest(DieType.D20, (n) => n + 5, {
        testType: TestType.AtLeast,
        target: 15,
      });

      expect(result).toHaveProperty("base");
      expect(result).toHaveProperty("modified");
      expect(result).toHaveProperty("outcome");
      expect(typeof result.base).toBe("number");
      expect(typeof result.modified).toBe("number");
      expect(typeof result.outcome).toBe("string");
    });

    it("should apply modifier to base roll", () => {
      const result = rollModTest(DieType.D20, (n) => n + 10, {
        testType: TestType.AtLeast,
        target: 15,
      });

      expect(result.modified).toBe(result.base + 10);
    });

    it("should evaluate outcome based on modified value, not base", () => {
      // Mock Math.random to return consistent values
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.4); // Will roll an 8 on d20 (0.4 * 20 = 8)

      const result = rollModTest(
        DieType.D20,
        (n) => n + 10, // Base 8 + 10 = 18
        { testType: TestType.AtLeast, target: 15 }
      );

      expect(result.base).toBe(9); // floor(0.4 * 20) + 1 = 9
      expect(result.modified).toBe(19);
      expect(result.outcome).toBe(Outcome.Success);

      Math.random = originalRandom;
    });
  });

  describe("modifier types", () => {
    it("should accept a plain function as modifier", () => {
      const result = rollModTest(DieType.D6, (n) => n * 2, {
        testType: TestType.AtLeast,
        target: 6,
      });

      expect(result.modified).toBe(result.base * 2);
    });

    it("should accept a RollModifier instance", () => {
      const modifier = new RollModifier((n) => n + 3);
      const result = rollModTest(DieType.D6, modifier, {
        testType: TestType.AtLeast,
        target: 5,
      });

      expect(result.modified).toBe(result.base + 3);
    });
  });

  describe("test condition types", () => {
    it("should work with ModifiedTestConditions instance", () => {
      const {
        ModifiedTestConditions,
      } = require("../src/entities/ModifiedTestConditions");
      const conditions = new ModifiedTestConditions(
        TestType.AtLeast,
        { target: 15 },
        DieType.D20,
        (n) => n + 5
      );

      const result = rollModTest(DieType.D20, (n) => n + 5, conditions);

      expect(result).toHaveProperty("outcome");
      expect([
        Outcome.Success,
        Outcome.Failure,
        Outcome.CriticalSuccess,
        Outcome.CriticalFailure,
      ]).toContain(result.outcome);
    });

    it("should work with plain object test conditions", () => {
      const result = rollModTest(DieType.D20, (n) => n + 5, {
        testType: TestType.AtMost,
        target: 15,
      });

      expect(result).toHaveProperty("outcome");
    });

    it("should handle AtLeast test type correctly", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.45); // Will roll 10 on d20

      const result = rollModTest(
        DieType.D20,
        (n) => n + 5, // 10 + 5 = 15
        { testType: TestType.AtLeast, target: 15 }
      );

      expect(result.modified).toBe(15);
      expect(result.outcome).toBe(Outcome.Success);

      Math.random = originalRandom;
    });

    it("should handle Exact test type correctly", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.25); // Will roll 6 on d20

      const result = rollModTest(
        DieType.D20,
        (n) => n + 4, // 6 + 4 = 10
        { testType: TestType.Exact, target: 10 }
      );

      expect(result.modified).toBe(10);
      expect(result.outcome).toBe(Outcome.Success);

      Math.random = originalRandom;
    });

    it("should handle Skill test type with critical success", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.95); // Will roll 20 on d20

      const result = rollModTest(
        DieType.D20,
        (n) => n, // No modification
        {
          testType: TestType.Skill,
          target: 12,
          critical_success: 20,
          critical_failure: 1,
        }
      );

      expect(result.base).toBe(20);
      expect(result.outcome).toBe(Outcome.CriticalSuccess);

      Math.random = originalRandom;
    });
  });

  describe("roll types (advantage/disadvantage)", () => {
    it("should support advantage", () => {
      const originalRandom = Math.random;
      const rolls = [0.1, 0.9]; // Will roll 2 and 18 on d20
      let callCount = 0;
      Math.random = jest.fn(() => rolls[callCount++]);

      const result = rollModTest(
        DieType.D20,
        (n) => n + 2,
        { testType: TestType.AtLeast, target: 15 },
        RollType.Advantage
      );

      expect(result.base).toBe(19); // max(3, 19) = 19
      expect(result.modified).toBe(21);
      expect(result.outcome).toBe(Outcome.Success);

      Math.random = originalRandom;
    });

    it("should support disadvantage", () => {
      const originalRandom = Math.random;
      const rolls = [0.1, 0.9]; // Will roll 2 and 18 on d20
      let callCount = 0;
      Math.random = jest.fn(() => rolls[callCount++]);

      const result = rollModTest(
        DieType.D20,
        (n) => n + 10,
        { testType: TestType.AtLeast, target: 15 },
        RollType.Disadvantage
      );

      expect(result.base).toBe(3); // min(3, 19) = 3
      expect(result.modified).toBe(13);
      expect(result.outcome).toBe(Outcome.Failure);

      Math.random = originalRandom;
    });
  });

  describe("validation", () => {
    it("should throw if dieType is missing", () => {
      expect(() =>
        rollModTest(null, (n) => n, { testType: TestType.AtLeast, target: 10 })
      ).toThrow(TypeError);
    });

    it("should throw if modifier is missing", () => {
      expect(() =>
        rollModTest(DieType.D20, null, {
          testType: TestType.AtLeast,
          target: 10,
        })
      ).toThrow(TypeError);
    });

    it("should throw if testConditions is missing", () => {
      expect(() => rollModTest(DieType.D20, (n) => n, null)).toThrow(TypeError);
    });

    it("should throw if dieType is invalid", () => {
      expect(() =>
        rollModTest("invalid", (n) => n, {
          testType: TestType.AtLeast,
          target: 10,
        })
      ).toThrow();
    });

    it("should throw if modifier is invalid", () => {
      expect(() =>
        rollModTest(DieType.D20, "not a function", {
          testType: TestType.AtLeast,
          target: 10,
        })
      ).toThrow();
    });
  });

  describe("edge cases", () => {
    it("should handle modifier that returns the same value", () => {
      const result = rollModTest(DieType.D6, (n) => n, {
        testType: TestType.AtLeast,
        target: 1,
      });

      expect(result.modified).toBe(result.base);
    });

    it("should handle modifier that reduces the roll value", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.9); // Will roll 19 on d20

      const result = rollModTest(
        DieType.D20,
        (n) => n - 10, // 19 - 10 = 9
        { testType: TestType.AtLeast, target: 10 }
      );

      expect(result.base).toBe(19);
      expect(result.modified).toBe(9);
      expect(result.outcome).toBe(Outcome.Failure);

      Math.random = originalRandom;
    });

    it("should handle modifier that increases the roll value", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.1); // Will roll 1 on d6 (floor(0.1 * 6) + 1 = 1)

      const result = rollModTest(
        DieType.D6,
        (n) => n + 3, // 1 + 3 = 4
        { testType: TestType.AtLeast, target: 4 }
      );

      expect(result.base).toBe(1);
      expect(result.modified).toBe(4);
      expect(result.outcome).toBe(Outcome.Success);

      Math.random = originalRandom;
    });
  });

  describe("extended range validation", () => {
    it("should accept target above base die range when modifier extends it", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.9); // Will roll 6 on d6

      // D6 + 10 modifier gives range 11-16, target 15 is valid
      const result = rollModTest(DieType.D6, (n) => n + 10, {
        testType: TestType.AtLeast,
        target: 15,
      });

      expect(result.base).toBe(6);
      expect(result.modified).toBe(16);
      expect(result.outcome).toBe(Outcome.Success);

      Math.random = originalRandom;
    });

    it("should accept target below base die range when negative modifier reduces it", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.05); // Will roll 2 on d20 (floor(0.05 * 20) + 1 = 2)

      // D20 - 5 modifier gives range -4 to 15, target 0 is valid
      const result = rollModTest(DieType.D20, (n) => n - 5, {
        testType: TestType.AtMost,
        target: 0,
      });

      expect(result.base).toBe(2);
      expect(result.modified).toBe(-3);
      expect(result.outcome).toBe(Outcome.Success);

      Math.random = originalRandom;
    });

    it("should reject target outside achievable modified range", () => {
      // D6 + 5 gives range 6-11, target 15 is impossible
      expect(() => {
        rollModTest(DieType.D6, (n) => n + 5, {
          testType: TestType.AtLeast,
          target: 15,
        });
      }).toThrow(RangeError);
    });

    it("should handle exact value tests with extended range", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.5); // Will roll 4 on d6

      // D6 * 2 gives range 2-12, target 8 is achievable (4*2=8)
      const result = rollModTest(DieType.D6, (n) => n * 2, {
        testType: TestType.Exact,
        target: 8,
      });

      expect(result.base).toBe(4);
      expect(result.modified).toBe(8);
      expect(result.outcome).toBe(Outcome.Success);

      Math.random = originalRandom;
    });

    it("should handle skill tests with critical thresholds in extended range", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.95); // Will roll 6 on d6

      // D6 + 15 gives range 16-21
      const result = rollModTest(DieType.D6, (n) => n + 15, {
        testType: TestType.Skill,
        target: 18,
        critical_success: 21,
        critical_failure: 16,
      });

      expect(result.base).toBe(6);
      expect(result.modified).toBe(21);
      expect(result.outcome).toBe(Outcome.CriticalSuccess);

      Math.random = originalRandom;
    });
  });
});
