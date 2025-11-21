/**
 * @file outcomeMapper.test.js
 * @description
 * Unit tests for @platonic-dice/core/src/utils/outcomeMapper.
 *
 * Covers outcome map creation, caching behavior, and natural crit logic.
 */

const {
  createOutcomeMap,
  clearOutcomeMapCache,
  getOutcomeMapCacheSize,
} = require("../../src/utils/outcomeMapper");
const {
  DieType,
  TestType,
  TestConditions,
  Outcome,
  RollModifier,
} = require("../../src/entities");

describe("@platonic-dice/core/utils/outcomeMapper", () => {
  beforeEach(() => {
    clearOutcomeMapCache();
  });

  afterEach(() => {
    clearOutcomeMapCache();
  });

  describe("createOutcomeMap", () => {
    it("should create outcome map for all possible die rolls", () => {
      const conditions = new TestConditions(
        TestType.AtLeast,
        { target: 4 },
        DieType.D6
      );
      const map = createOutcomeMap(DieType.D6, TestType.AtLeast, conditions);

      expect(Object.keys(map).length).toBe(6);
      expect(map[1]).toBe(Outcome.Failure);
      expect(map[2]).toBe(Outcome.Failure);
      expect(map[3]).toBe(Outcome.Failure);
      expect(map[4]).toBe(Outcome.Success);
      expect(map[5]).toBe(Outcome.Success);
      expect(map[6]).toBe(Outcome.Success);
    });

    it("should apply modifier when provided", () => {
      const conditions = new TestConditions(
        TestType.AtLeast,
        { target: 6 },
        DieType.D6
      );
      const modifier = new RollModifier((n) => n + 5);
      const map = createOutcomeMap(
        DieType.D6,
        TestType.AtLeast,
        conditions,
        modifier
      );

      // Base roll 1 + 5 = 6 (>= 6) → Success
      expect(map[1]).toBe(Outcome.Success);
      // Base roll 5 + 5 = 10 (>= 6) → Success
      expect(map[5]).toBe(Outcome.Success);
      // Base roll 6 + 5 = 11 (>= 6) → Success
      expect(map[6]).toBe(Outcome.Success);
    });

    it("should auto-enable natural crits for Skill tests", () => {
      const conditions = new TestConditions(
        TestType.Skill,
        {
          target: 10,
          critical_success: 20,
          critical_failure: 1,
        },
        DieType.D20
      );
      const map = createOutcomeMap(DieType.D20, TestType.Skill, conditions);

      // Natural 20 = CriticalSuccess (auto-enabled)
      expect(map[20]).toBe(Outcome.CriticalSuccess);
      // Natural 1 = CriticalFailure (auto-enabled)
      expect(map[1]).toBe(Outcome.CriticalFailure);
    });

    it("should NOT auto-enable natural crits for non-Skill tests", () => {
      const conditions = new TestConditions(
        TestType.AtLeast,
        { target: 15 },
        DieType.D20
      );
      const map = createOutcomeMap(DieType.D20, TestType.AtLeast, conditions);

      // Natural 20 = Success (not CriticalSuccess)
      expect(map[20]).toBe(Outcome.Success);
      // Natural 1 = Failure (not CriticalFailure)
      expect(map[1]).toBe(Outcome.Failure);
    });

    it("should respect explicit useNaturalCrits parameter", () => {
      const conditions = new TestConditions(
        TestType.AtLeast,
        { target: 15 },
        DieType.D20
      );
      const map = createOutcomeMap(
        DieType.D20,
        TestType.AtLeast,
        conditions,
        null,
        true // explicitly enable
      );

      // Natural 20 with natural crits enabled = Success (AtLeast uses Success, not CriticalSuccess)
      expect(map[20]).toBe(Outcome.Success);
      // Natural 1 = Failure
      expect(map[1]).toBe(Outcome.Failure);
    });

    it("should handle AtMost natural crit reversal", () => {
      const conditions = new TestConditions(
        TestType.AtMost,
        { target: 10 },
        DieType.D20
      );
      const map = createOutcomeMap(
        DieType.D20,
        TestType.AtMost,
        conditions,
        null,
        true
      );

      // Natural 1 (min) = Success (reversed logic)
      expect(map[1]).toBe(Outcome.Success);
      // Natural 20 (max) = Failure (reversed logic)
      expect(map[20]).toBe(Outcome.Failure);
    });

    it("should not apply natural crits to Exact test type", () => {
      const conditions = new TestConditions(
        TestType.Exact,
        { target: 10 },
        DieType.D20
      );
      const map = createOutcomeMap(
        DieType.D20,
        TestType.Exact,
        conditions,
        null,
        true
      );

      // Natural crits don't apply to Exact
      expect(map[1]).toBe(Outcome.Failure); // Not overridden
      expect(map[10]).toBe(Outcome.Success);
      expect(map[20]).toBe(Outcome.Failure); // Not overridden
    });
  });

  describe("caching behavior", () => {
    it("should cache outcome maps", () => {
      const conditions = new TestConditions(
        TestType.AtLeast,
        { target: 15 },
        DieType.D20
      );

      expect(getOutcomeMapCacheSize()).toBe(0);

      createOutcomeMap(DieType.D20, TestType.AtLeast, conditions);
      expect(getOutcomeMapCacheSize()).toBe(1);

      // Second call should hit cache (size doesn't increase)
      createOutcomeMap(DieType.D20, TestType.AtLeast, conditions);
      expect(getOutcomeMapCacheSize()).toBe(1);
    });

    it("should create separate cache entries for different conditions", () => {
      const cond1 = new TestConditions(
        TestType.AtLeast,
        { target: 15 },
        DieType.D20
      );
      const cond2 = new TestConditions(
        TestType.AtLeast,
        { target: 16 },
        DieType.D20
      );

      createOutcomeMap(DieType.D20, TestType.AtLeast, cond1);
      expect(getOutcomeMapCacheSize()).toBe(1);

      createOutcomeMap(DieType.D20, TestType.AtLeast, cond2);
      expect(getOutcomeMapCacheSize()).toBe(2);
    });

    it("should create separate cache entries for different modifiers", () => {
      const conditions = new TestConditions(
        TestType.AtLeast,
        { target: 15 },
        DieType.D20
      );
      const mod1 = new RollModifier((n) => n + 5);
      const mod2 = new RollModifier((n) => n + 10);

      createOutcomeMap(DieType.D20, TestType.AtLeast, conditions, mod1);
      expect(getOutcomeMapCacheSize()).toBe(1);

      createOutcomeMap(DieType.D20, TestType.AtLeast, conditions, mod2);
      expect(getOutcomeMapCacheSize()).toBe(2);
    });

    it("should return cached map on subsequent calls", () => {
      const conditions = new TestConditions(
        TestType.AtLeast,
        { target: 15 },
        DieType.D20
      );

      const map1 = createOutcomeMap(DieType.D20, TestType.AtLeast, conditions);
      const map2 = createOutcomeMap(DieType.D20, TestType.AtLeast, conditions);

      // Should be the exact same object reference (cached)
      expect(map1).toBe(map2);
    });
  });

  describe("clearOutcomeMapCache", () => {
    it("should clear all cached outcome maps", () => {
      const cond1 = new TestConditions(
        TestType.AtLeast,
        { target: 15 },
        DieType.D20
      );
      const cond2 = new TestConditions(
        TestType.AtLeast,
        { target: 16 },
        DieType.D20
      );

      createOutcomeMap(DieType.D20, TestType.AtLeast, cond1);
      createOutcomeMap(DieType.D20, TestType.AtLeast, cond2);
      expect(getOutcomeMapCacheSize()).toBe(2);

      clearOutcomeMapCache();
      expect(getOutcomeMapCacheSize()).toBe(0);
    });
  });

  describe("getOutcomeMapCacheSize", () => {
    it("should return 0 when cache is empty", () => {
      expect(getOutcomeMapCacheSize()).toBe(0);
    });

    it("should return correct count of cached maps", () => {
      const conditions = new TestConditions(
        TestType.AtLeast,
        { target: 15 },
        DieType.D20
      );

      for (let i = 10; i < 15; i++) {
        const cond = new TestConditions(
          TestType.AtLeast,
          { target: i },
          DieType.D20
        );
        createOutcomeMap(DieType.D20, TestType.AtLeast, cond);
      }

      expect(getOutcomeMapCacheSize()).toBe(5);
    });
  });

  describe("integration with different test types", () => {
    it("should work with Within test type", () => {
      const conditions = new TestConditions(
        TestType.Within,
        { min: 3, max: 5 },
        DieType.D6
      );
      const map = createOutcomeMap(DieType.D6, TestType.Within, conditions);

      expect(map[1]).toBe(Outcome.Failure);
      expect(map[2]).toBe(Outcome.Failure);
      expect(map[3]).toBe(Outcome.Success);
      expect(map[4]).toBe(Outcome.Success);
      expect(map[5]).toBe(Outcome.Success);
      expect(map[6]).toBe(Outcome.Failure);
    });

    it("should work with InList test type", () => {
      const conditions = new TestConditions(
        TestType.InList,
        { values: [2, 4, 6] },
        DieType.D6
      );
      const map = createOutcomeMap(DieType.D6, TestType.InList, conditions);

      expect(map[1]).toBe(Outcome.Failure);
      expect(map[2]).toBe(Outcome.Success);
      expect(map[3]).toBe(Outcome.Failure);
      expect(map[4]).toBe(Outcome.Success);
      expect(map[5]).toBe(Outcome.Failure);
      expect(map[6]).toBe(Outcome.Success);
    });
  });
});
