/**
 * @jest-environment node
 */

const { rollTest } = require("../../src/rollTest.js");
const { DieType, TestType, Outcome } = require("../../src/entities");

describe("rollTest - Natural Crits", () => {
  describe("default behavior (auto-enable for Skill tests)", () => {
    it("should auto-enable natural crits for Skill tests", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.999); // Will roll 20 on d20

      const result = rollTest(DieType.D20, {
        testType: TestType.Skill,
        target: 15,
        critical_success: 20,
        critical_failure: 1,
      });

      expect(result.base).toBe(20);
      expect(result.outcome).toBe(Outcome.CriticalSuccess);

      Math.random = originalRandom;
    });

    it("should NOT auto-enable natural crits for non-Skill tests", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.999); // Will roll 20 on d20

      const result = rollTest(DieType.D20, {
        testType: TestType.AtLeast,
        target: 15,
      });

      expect(result.base).toBe(20);
      expect(result.outcome).toBe(Outcome.Success); // Not overridden

      Math.random = originalRandom;
    });
  });

  describe("explicit useNaturalCrits: true for Skill tests", () => {
    it("should trigger critical success on natural max roll", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.999); // Will roll 20 on d20

      const result = rollTest(
        DieType.D20,
        {
          testType: TestType.Skill,
          target: 15,
          critical_success: 20,
          critical_failure: 1,
        },
        undefined,
        { useNaturalCrits: true }
      );

      expect(result.base).toBe(20);
      expect(result.outcome).toBe(Outcome.CriticalSuccess);

      Math.random = originalRandom;
    });

    it("should trigger critical failure on natural 1", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.001); // Will roll 1 on d20

      const result = rollTest(
        DieType.D20,
        {
          testType: TestType.Skill,
          target: 15,
          critical_success: 20,
          critical_failure: 1,
        },
        undefined,
        { useNaturalCrits: true }
      );

      expect(result.base).toBe(1);
      expect(result.outcome).toBe(Outcome.CriticalFailure);

      Math.random = originalRandom;
    });
  });

  describe("explicit useNaturalCrits: true for non-Skill tests", () => {
    it("should trigger Success on natural max for AtLeast test", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.999); // Will roll 20 on d20

      // Without natural crits, 20 >= 20 would be Success anyway
      // But if we had rolled 19, it would fail
      // Natural crits ensures ANY natural 20 = Success
      const result = rollTest(
        DieType.D20,
        {
          testType: TestType.AtLeast,
          target: 20, // Only natural 20 hits this
        },
        undefined,
        { useNaturalCrits: true }
      );

      expect(result.base).toBe(20);
      expect(result.outcome).toBe(Outcome.Success);

      Math.random = originalRandom;
    });

    it("should trigger Failure on natural 1 for AtLeast test", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.001); // Will roll 1 on d20

      const result = rollTest(
        DieType.D20,
        {
          testType: TestType.AtLeast,
          target: 1, // Should normally succeed
        },
        undefined,
        { useNaturalCrits: true }
      );

      expect(result.base).toBe(1);
      expect(result.outcome).toBe(Outcome.Failure); // Overridden to failure

      Math.random = originalRandom;
    });

    it("should NOT work with Exact test type (natural crits don't apply)", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.999); // Will roll 6 on d6

      const result = rollTest(
        DieType.D6,
        {
          testType: TestType.Exact,
          target: 3, // Not 6
        },
        undefined,
        { useNaturalCrits: true }
      );

      expect(result.base).toBe(6);
      expect(result.outcome).toBe(Outcome.Failure); // Natural crits don't apply to Exact

      Math.random = originalRandom;
    });

    it("should work with AtMost test type (reversed logic)", () => {
      const originalRandom = Math.random;

      // Test natural max = failure for AtMost
      Math.random = jest.fn(() => 0.999); // Will roll 20 on d20
      const result1 = rollTest(
        DieType.D20,
        {
          testType: TestType.AtMost,
          target: 10,
        },
        undefined,
        { useNaturalCrits: true }
      );
      expect(result1.base).toBe(20);
      expect(result1.outcome).toBe(Outcome.Failure); // Natural max = failure for AtMost

      // Test natural 1 = success for AtMost
      Math.random = jest.fn(() => 0.001); // Will roll 1
      const result2 = rollTest(
        DieType.D20,
        {
          testType: TestType.AtMost,
          target: 10,
        },
        undefined,
        { useNaturalCrits: true }
      );
      expect(result2.base).toBe(1);
      expect(result2.outcome).toBe(Outcome.Success); // Natural 1 = success for AtMost

      Math.random = originalRandom;
    });
  });

  describe("explicit useNaturalCrits: false", () => {
    it("should disable natural crits for Skill tests", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.9); // Will roll 19 on d20

      const result = rollTest(
        DieType.D20,
        {
          testType: TestType.Skill,
          target: 15,
          critical_success: 20, // 19 doesn't reach this
          critical_failure: 1,
        },
        undefined,
        { useNaturalCrits: false }
      );

      expect(result.base).toBe(19);
      expect(result.outcome).toBe(Outcome.Success); // Not critical (19 < 20)

      Math.random = originalRandom;
    });

    it("should not affect non-Skill tests (already default false)", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.999); // Will roll 20 on d20

      const result = rollTest(
        DieType.D20,
        {
          testType: TestType.AtLeast,
          target: 15,
        },
        undefined,
        { useNaturalCrits: false }
      );

      expect(result.base).toBe(20);
      expect(result.outcome).toBe(Outcome.Success); // Normal evaluation

      Math.random = originalRandom;
    });
  });

  describe("different die types", () => {
    it("should work with D6", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.999); // Will roll 6

      const result = rollTest(
        DieType.D6,
        {
          testType: TestType.Skill,
          target: 4,
          critical_success: 6,
          critical_failure: 1,
        },
        undefined,
        { useNaturalCrits: true }
      );

      expect(result.base).toBe(6);
      expect(result.outcome).toBe(Outcome.CriticalSuccess);

      Math.random = originalRandom;
    });

    it("should work with D12", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.001); // Will roll 1

      const result = rollTest(
        DieType.D12,
        {
          testType: TestType.Skill,
          target: 7,
          critical_success: 12,
          critical_failure: 1,
        },
        undefined,
        { useNaturalCrits: true }
      );

      expect(result.base).toBe(1);
      expect(result.outcome).toBe(Outcome.CriticalFailure);

      Math.random = originalRandom;
    });
  });
});
