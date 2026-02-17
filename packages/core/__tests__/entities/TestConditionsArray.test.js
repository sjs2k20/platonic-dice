const {
  TestConditions,
  TestType,
  DieType,
  TestConditionsArray,
} = require("../../src/entities");

const { determineOutcome } = require("../../src/utils/determineOutcome");

describe("TestConditionsArray", () => {
  test("accepts TestConditions instances as-is", () => {
    const tc = new TestConditions(TestType.AtLeast, { target: 4 }, DieType.D6);
    const arr = new TestConditionsArray([tc]);
    const out = arr.toArray();
    expect(out.length).toBe(1);
    expect(out[0]).toBe(tc);
  });

  test("normalises plain objects with per-entry dieType", () => {
    const input = [
      { testType: TestType.Exact, target: 3, dieType: DieType.D6 },
      { testType: TestType.AtLeast, target: 15, dieType: DieType.D20 },
    ];

    const arr = new TestConditionsArray(input);
    const out = arr.toArray();
    expect(out.length).toBe(2);
    expect(out[0].dieType).toBe(DieType.D6);
    expect(out[1].dieType).toBe(DieType.D20);
  });

  test("uses default dieType when entries omit dieType", () => {
    const input = [{ testType: TestType.Exact, target: 2 }];
    const arr = new TestConditionsArray(input, DieType.D6);
    const out = arr.toArray();
    expect(out[0].dieType).toBe(DieType.D6);
  });

  test("evaluateEach delegates to provided evaluator", () => {
    const input = [{ testType: TestType.Exact, target: 4 }];
    const arr = new TestConditionsArray(input, DieType.D6);

    // evaluator uses existing determineOutcome helper
    const evaluator = (value, tc) => determineOutcome(value, tc);

    const outcomes = arr.evaluateEach(4, evaluator);
    expect(Array.isArray(outcomes)).toBe(true);
    expect(outcomes[0]).toBe("success");
  });

  test("throws when plain element lacks dieType and no default provided", () => {
    const input = [{ testType: TestType.Exact, target: 1 }];
    expect(() => new TestConditionsArray(input)).toThrow();
  });
});
