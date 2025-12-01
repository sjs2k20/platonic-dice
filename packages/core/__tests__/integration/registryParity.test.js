/**
 * Ensure registry evaluators (when present) match legacy `createOutcomeMap`.
 * This is a non-mocking integration test that exercises the real registry.
 */

const { getRegistration } = require("../../src/utils/testRegistry.js");
const { createOutcomeMap } = require("../../src/utils/outcomeMapper.js");
const { DieType } = require("../../src/entities/DieType.js");
const { TestType } = require("../../src/entities/TestType.js");
const { TestConditions } = require("../../src/entities/TestConditions.js");
const { RollModifier } = require("../../src/entities/RollModifier.js");

describe("testRegistry parity with createOutcomeMap", () => {
  it("at_least evaluator matches createOutcomeMap for D6", () => {
    const reg = getRegistration(TestType.AtLeast);
    expect(reg).toBeDefined();

    const conditions = new TestConditions(
      TestType.AtLeast,
      { target: 4 },
      DieType.D6
    );
    const evalFn = reg.buildEvaluator(DieType.D6, conditions, null, null);
    const map = createOutcomeMap(
      DieType.D6,
      TestType.AtLeast,
      conditions,
      null,
      null
    );

    for (let b = 1; b <= 6; b++) {
      expect(evalFn(b)).toBe(map[b]);
    }
  });

  it("skill evaluator matches createOutcomeMap for D20 with RollModifier", () => {
    const reg = getRegistration(TestType.Skill);
    expect(reg).toBeDefined();

    const mod = new RollModifier((n) => n + 3);
    const conditions = new TestConditions(
      TestType.Skill,
      { target: 12, critical_success: 20, critical_failure: 1 },
      DieType.D20
    );
    const evalFn = reg.buildEvaluator(DieType.D20, conditions, mod, true);
    const map = createOutcomeMap(
      DieType.D20,
      TestType.Skill,
      conditions,
      mod,
      true
    );

    for (let b = 1; b <= 20; b++) {
      expect(evalFn(b)).toBe(map[b]);
    }
  });

  it("within evaluator matches createOutcomeMap for D8", () => {
    const reg = getRegistration(TestType.Within);
    expect(reg).toBeDefined();

    const conditions = new TestConditions(
      TestType.Within,
      { min: 2, max: 5 },
      DieType.D8
    );
    const evalFn = reg.buildEvaluator(DieType.D8, conditions, null, null);
    const map = createOutcomeMap(
      DieType.D8,
      TestType.Within,
      conditions,
      null,
      null
    );

    for (let b = 1; b <= 8; b++) {
      expect(evalFn(b)).toBe(map[b]);
    }
  });
});
