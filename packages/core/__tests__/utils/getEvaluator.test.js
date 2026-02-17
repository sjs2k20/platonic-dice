/* eslint-env jest */
const { getEvaluator } = require("../../src/utils/getEvaluator");
const { DieType } = require("../../src/entities/DieType");
const { TestType } = require("../../src/entities/TestType");
const { Outcome } = require("../../src/entities/Outcome");
const tcModule = require("../../src/entities/TestConditions");
const tr = require("../../src/utils/testRegistry");

describe("getEvaluator", () => {
  it("returns an evaluator that matches createOutcomeMap for built-in test type", () => {
    const conditionsObj = {
      testType: TestType.AtLeast,
      target: 4,
      dieType: DieType.D6,
    };

    const evaluator = getEvaluator(DieType.D6, conditionsObj, null, null);

    expect(typeof evaluator).toBe("function");
    expect(evaluator(4)).toBe(Outcome.Success);
    expect(evaluator(3)).toBe(Outcome.Failure);
  });

  it("falls back to createOutcomeMap when registry entry removed", () => {
    const registry = tr.registry; // Map
    const saved = registry.get("at_least");
    try {
      // remove built-in so getEvaluator must fall back
      registry.delete("at_least");

      // Create an actual TestConditions instance (normaliseTestConditions will be used internally)
      const tc = new tcModule.TestConditions(
        TestType.AtLeast,
        { target: 5 },
        DieType.D6
      );

      const evaluator = getEvaluator(DieType.D6, tc, null, null);
      expect(evaluator(5)).toBe(Outcome.Success);
      expect(evaluator(4)).toBe(Outcome.Failure);
    } finally {
      if (saved) registry.set("at_least", saved);
    }
  });
});
