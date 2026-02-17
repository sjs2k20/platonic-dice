const { DiceTestConditions, TestType } = require("../../src/entities");

describe("DiceTestConditions - value_count and condition_count rules", () => {
  test("value_count atLeast passes when enough dice equal the value", () => {
    const dtc = new DiceTestConditions({
      count: 3,
      conditions: [{ testType: TestType.Exact, target: 6 }],
      rules: [{ type: "value_count", value: 6, atLeast: 2 }],
    });

    const res = dtc.evaluateRolls([6, 6, 1]);
    expect(res.passed).toBe(true);
    expect(res.ruleResults[0].count).toBe(2);
  });

  test("condition_count counts successes for condition index", () => {
    const dtc = new DiceTestConditions({
      count: 3,
      conditions: [
        { testType: TestType.Exact, target: 6 },
        { testType: TestType.AtLeast, target: 4 },
      ],
      rules: [{ type: "condition_count", conditionIndex: 1, atLeast: 2 }],
    });

    const res = dtc.evaluateRolls([5, 4, 3]);
    expect(res.ruleResults[0].count).toBe(2);
    expect(res.passed).toBe(true);
  });
});
