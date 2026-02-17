/**
 * @jest-environment node
 */

const {
  getRegistration,
  registry,
} = require("../../src/utils/testRegistry.js");
const { createOutcomeMap } = require("../../src/utils/outcomeMapper.js");
const { DieType } = require("../../src/entities/DieType.js");
const { TestType } = require("../../src/entities/TestType.js");
const { TestConditions } = require("../../src/entities/TestConditions.js");

describe("testRegistry", () => {
  it("exposes built-in registrations", () => {
    const builtIns = [
      "at_least",
      "at_most",
      "exact",
      "within",
      "in_list",
      "skill",
    ];
    for (const t of builtIns) {
      const reg = getRegistration(t);
      expect(reg).toBeDefined();
      expect(typeof reg.validateShape).toBe("function");
    }
  });

  it("validateShape delegates to validators and rejects bad shapes", () => {
    const reg = getRegistration("at_least");
    expect(reg.validateShape({ dieType: DieType.D6, target: 4 })).toBe(true);
    expect(reg.validateShape({ dieType: DieType.D6, target: 999 })).toBe(false);
  });

  it("buildEvaluator returns an evaluator that matches createOutcomeMap for a sample config", () => {
    const reg = getRegistration("at_least");
    const conditions = new TestConditions(
      TestType.AtLeast,
      { target: 4 },
      DieType.D6
    );

    const evalFn = reg.buildEvaluator(DieType.D6, conditions, null, null);
    expect(typeof evalFn).toBe("function");

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
});
