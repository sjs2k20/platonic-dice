const {
  TestConditionsArray,
  TestType,
  DieType,
} = require("../../src/entities");

const { getArrayEvaluator } = require("../../src/utils/getArrayEvaluator");

describe("getArrayEvaluator", () => {
  test("builds an evaluator that returns an array of outcomes", () => {
    const tcArray = new TestConditionsArray(
      [
        { testType: TestType.Exact, target: 4 },
        { testType: TestType.AtLeast, target: 3 },
      ],
      DieType.D6,
    );

    const evaluator = getArrayEvaluator(tcArray);
    const outcomes = evaluator(4);
    expect(Array.isArray(outcomes)).toBe(true);
    expect(outcomes.length).toBe(2);
    expect(outcomes[0]).toBe("success");
    expect(outcomes[1]).toBe("success");
  });

  test("throws when missing or invalid input provided", () => {
    expect(() => getArrayEvaluator()).toThrow();
    expect(() => getArrayEvaluator({})).toThrow();
  });
});
