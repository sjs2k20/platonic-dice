/**
 * Example usage of TestConditionsArray
 * Demonstrates normalising and evaluating multiple test conditions.
 */

const {
  TestConditionsArray,
  TestConditions,
  TestType,
  DieType,
} = require("../../src");
const { getEvaluator } = require("../../src/utils/getEvaluator.js");

console.log("=== TestConditionsArray Examples ===\n");

// Example 1: Build from plain objects with default die type
console.log("--- Constructing from plain objects ---");
const plainArray = new TestConditionsArray(
  [
    { testType: TestType.AtLeast, target: 4 },
    { testType: TestType.Exact, target: 6 },
    { testType: TestType.InList, values: [1, 2] },
  ],
  DieType.D6,
);

console.log("Condition count:", plainArray.toArray().length);
console.log(
  "Test types:",
  plainArray
    .toArray()
    .map((tc) => tc.testType)
    .join(", "),
);
console.log();

// Example 2: Mix class instances and plain objects
console.log("--- Mixing instances and objects ---");
const exactTen = new TestConditions(
  TestType.Exact,
  { target: 10 },
  DieType.D20,
);
const mixed = new TestConditionsArray(
  [exactTen, { testType: TestType.AtLeast, target: 15, dieType: DieType.D20 }],
  undefined,
);

console.log("Mixed condition count:", mixed.toArray().length);
console.log(
  "Die types:",
  mixed
    .toArray()
    .map((tc) => tc.dieType)
    .join(", "),
);
console.log();

// Example 3: Evaluate a single value against all conditions
console.log("--- evaluateEach(value) ---");
const conditions = plainArray.toArray();
const evaluators = conditions.map((tc) => getEvaluator(tc.dieType, tc));
const value = 5;

const outcomes = plainArray.evaluateEach(value, (v, tc) => {
  const idx = conditions.indexOf(tc);
  return evaluators[idx](v);
});

console.log(`Value ${value} outcomes:`, outcomes);
