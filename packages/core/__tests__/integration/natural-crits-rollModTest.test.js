/**
 * @jest-environment node
 */

const { rollModTest } = require("../../src/rollModTest.js");
const {
  DieType,
  RollType,
  RollModifier,
  TestType,
  Outcome,
} = require("../../src/entities");

describe("rollModTest - Natural Crits", () => {
  describe("useNaturalCrits option", () => {
    it("should trigger critical success on natural max roll (Skill test)", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.999); // Will roll 20 on d20

      const result = rollModTest(
        DieType.D20,
        (n) => n + 5,
        {
          testType: TestType.Skill,
          target: 15,
          critical_success: 25, // Achievable with max roll (20+5=25)
          critical_failure: 6, // Achievable with min roll (1+5=6)
        },
        undefined,
        { useNaturalCrits: true }
      );

      expect(result.base).toBe(20);
      expect(result.modified).toBe(25);
      expect(result.outcome).toBe(Outcome.CriticalSuccess); // Natural 20 overrides

      Math.random = originalRandom;
    });

    it("should trigger critical failure on natural 1 roll (Skill test)", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.001); // Will roll 1 on d20

      const result = rollModTest(
        DieType.D20,
        (n) => n + 100, // Huge bonus
        {
          testType: TestType.Skill,
          target: 105,
          critical_success: 120, // Achievable (20+100=120)
          critical_failure: 101, // Achievable (1+100=101)
        },
        undefined,
        { useNaturalCrits: true }
      );

      expect(result.base).toBe(1);
      expect(result.modified).toBe(101);
      expect(result.outcome).toBe(Outcome.CriticalFailure); // Natural 1 overrides

      Math.random = originalRandom;
    });

    it("should not affect non-Skill test types", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.999); // Will roll 20 on d20

      const result = rollModTest(
        DieType.D20,
        (n) => n + 5,
        {
          testType: TestType.AtLeast,
          target: 15,
        },
        undefined,
        { useNaturalCrits: true }
      );

      expect(result.base).toBe(20);
      expect(result.outcome).toBe(Outcome.Success); // Not CriticalSuccess

      Math.random = originalRandom;
    });

    it("should not trigger when useNaturalCrits is false", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.9); // Will roll 19 on d20 (floor(0.9*20)+1=18+1=19)

      const result = rollModTest(
        DieType.D20,
        (n) => n + 5,
        {
          testType: TestType.Skill,
          target: 15,
          critical_success: 25, // Only achievable on natural 20 (20+5=25)
          critical_failure: 6, // Achievable (1+5=6)
        },
        undefined,
        { useNaturalCrits: false }
      );

      expect(result.base).toBe(19);
      expect(result.modified).toBe(24);
      expect(result.outcome).toBe(Outcome.Success); // 24 >= 15 but < 25

      Math.random = originalRandom;
    });

    it("should work with different die types", () => {
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.999); // Will roll max value

      // D6: natural 6
      const result1 = rollModTest(
        DieType.D6,
        (n) => n + 2,
        {
          testType: TestType.Skill,
          target: 5,
          critical_success: 8, // Achievable (6+2=8)
          critical_failure: 3, // Achievable (1+2=3)
        },
        undefined,
        { useNaturalCrits: true }
      );

      expect(result1.base).toBe(6);
      expect(result1.outcome).toBe(Outcome.CriticalSuccess);

      Math.random = jest.fn(() => 0.001); // Will roll 1

      // D6: natural 1
      const result2 = rollModTest(
        DieType.D6,
        (n) => n + 10,
        {
          testType: TestType.Skill,
          target: 13,
          critical_success: 16, // Achievable (6+10=16)
          critical_failure: 11, // Achievable (1+10=11)
        },
        undefined,
        { useNaturalCrits: true }
      );

      expect(result2.base).toBe(1);
      expect(result2.outcome).toBe(Outcome.CriticalFailure);

      Math.random = originalRandom;
    });
  });
});

describe("rollModTest - Advantage/Disadvantage with Outcomes", () => {
  describe("outcome-based advantage", () => {
    it("should pick the better outcome, not just higher base roll", () => {
      const originalRandom = Math.random;
      const rolls = [0.9, 0.05]; // Will roll 19 and 2 on d20
      let callCount = 0;
      Math.random = jest.fn(() => rolls[callCount++]);

      // With a modifier, 2+5=7 might be a success, while 19+5=24 might be critical
      const result = rollModTest(
        DieType.D20,
        (n) => n + 5,
        {
          testType: TestType.Skill,
          target: 8,
          critical_success: 24,
          critical_failure: 6,
        },
        RollType.Advantage
      );

      // Should pick 19 (24 modified, critical success) over 2 (7 modified, success)
      expect(result.base).toBe(19);
      expect(result.modified).toBe(24);
      expect(result.outcome).toBe(Outcome.CriticalSuccess);

      Math.random = originalRandom;
    });

    it("should pick success over failure", () => {
      const originalRandom = Math.random;
      const rolls = [0.7, 0.1]; // Will roll 15 and 3 on d20
      let callCount = 0;
      Math.random = jest.fn(() => rolls[callCount++]);

      const result = rollModTest(
        DieType.D20,
        (n) => n - 2,
        {
          testType: TestType.AtLeast,
          target: 12,
        },
        RollType.Advantage
      );

      // 15-2=13 (success), 3-2=1 (failure)
      expect(result.base).toBe(15);
      expect(result.modified).toBe(13);
      expect(result.outcome).toBe(Outcome.Success);

      Math.random = originalRandom;
    });

    it("should prefer critical success over regular success", () => {
      const originalRandom = Math.random;
      const rolls = [0.95, 0.6]; // Will roll 20 and 13 on d20
      let callCount = 0;
      Math.random = jest.fn(() => rolls[callCount++]);

      const result = rollModTest(
        DieType.D20,
        (n) => n + 2,
        {
          testType: TestType.Skill,
          target: 12,
          critical_success: 22,
          critical_failure: 3,
        },
        RollType.Advantage
      );

      // 20+2=22 (critical success), 13+2=15 (success)
      expect(result.base).toBe(20);
      expect(result.outcome).toBe(Outcome.CriticalSuccess);

      Math.random = originalRandom;
    });
  });

  describe("outcome-based disadvantage", () => {
    it("should pick the worse outcome, not just lower base roll", () => {
      const originalRandom = Math.random;
      const rolls = [0.1, 0.9]; // Will roll 3 and 19 on d20
      let callCount = 0;
      Math.random = jest.fn(() => rolls[callCount++]);

      const result = rollModTest(
        DieType.D20,
        (n) => n + 5,
        {
          testType: TestType.Skill,
          target: 12,
          critical_success: 24,
          critical_failure: 8,
        },
        RollType.Disadvantage
      );

      // 3+5=8 (critical failure), 19+5=24 (critical success)
      // Should pick critical failure (worse outcome)
      expect(result.base).toBe(3);
      expect(result.modified).toBe(8);
      expect(result.outcome).toBe(Outcome.CriticalFailure);

      Math.random = originalRandom;
    });

    it("should prefer failure over success", () => {
      const originalRandom = Math.random;
      const rolls = [0.7, 0.1]; // Will roll 15 and 3 on d20
      let callCount = 0;
      Math.random = jest.fn(() => rolls[callCount++]);

      const result = rollModTest(
        DieType.D20,
        (n) => n + 2,
        {
          testType: TestType.AtLeast,
          target: 15,
        },
        RollType.Disadvantage
      );

      // 15+2=17 (success), 3+2=5 (failure)
      expect(result.base).toBe(3);
      expect(result.modified).toBe(5);
      expect(result.outcome).toBe(Outcome.Failure);

      Math.random = originalRandom;
    });

    it("should prefer critical failure over regular failure", () => {
      const originalRandom = Math.random;
      const rolls = [0.05, 0.2]; // Will roll 2 and 5 on d20
      let callCount = 0;
      Math.random = jest.fn(() => rolls[callCount++]);

      const result = rollModTest(
        DieType.D20,
        (n) => n - 3,
        {
          testType: TestType.Skill,
          target: 10,
          critical_success: 17,
          critical_failure: 3,
        },
        RollType.Disadvantage
      );

      // 2-3=-1 (critical failure), 5-3=2 (failure)
      expect(result.base).toBe(2);
      expect(result.outcome).toBe(Outcome.CriticalFailure);

      Math.random = originalRandom;
    });
  });

  describe("advantage with natural crits", () => {
    it("should prioritise natural 20 even if other roll has better modified value", () => {
      const originalRandom = Math.random;
      const rolls = [0.999, 0.45]; // Will roll 20 and 10 on d20
      let callCount = 0;
      Math.random = jest.fn(() => rolls[callCount++]);

      const result = rollModTest(
        DieType.D20,
        (n) => n + 2,
        {
          testType: TestType.Skill,
          target: 12,
          critical_success: 22, // Achievable (20+2=22)
          critical_failure: 3, // Achievable (1+2=3)
        },
        RollType.Advantage,
        { useNaturalCrits: true }
      );

      // 20+2=22 (natural crit), 10+2=12 (success)
      expect(result.base).toBe(20);
      expect(result.outcome).toBe(Outcome.CriticalSuccess);

      Math.random = originalRandom;
    });

    it("should pick natural 1 over success when using disadvantage", () => {
      const originalRandom = Math.random;
      const rolls = [0.95, 0.001]; // Will roll 20 and 1 on d20
      let callCount = 0;
      Math.random = jest.fn(() => rolls[callCount++]);

      const result = rollModTest(
        DieType.D20,
        (n) => n + 100,
        {
          testType: TestType.Skill,
          target: 105,
          critical_success: 120, // Achievable (20+100=120)
          critical_failure: 101, // Achievable (1+100=101)
        },
        RollType.Disadvantage,
        { useNaturalCrits: true }
      );

      // 20+100=120 (critical success), 1+100=101 (natural fail = critical failure)
      expect(result.base).toBe(1);
      expect(result.outcome).toBe(Outcome.CriticalFailure);

      Math.random = originalRandom;
    });
  });
});
