/**
 * Example usage of rollDiceTest
 * Demonstrates rolling multiple dice and evaluating aggregate rules.
 */

const {
  rollDiceTest,
  DiceTestConditions,
  TestConditionsArray,
  DieType,
  TestType,
} = require("../src");

console.log("=== rollDiceTest Examples ===\n");

// Example 1: Plain conditions + rules
console.log("--- Plain conditions array ---");
const plain = rollDiceTest(
  DieType.D6,
  [
    { testType: TestType.AtLeast, target: 4 },
    { testType: TestType.Exact, target: 6 },
  ],
  {
    count: 5,
    rules: [
      { type: "condition_count", conditionIndex: 0, atLeast: 3 },
      { type: "condition_count", conditionIndex: 1, atLeast: 1 },
    ],
  },
);

console.log("Base rolls:", plain.base.array, "sum:", plain.base.sum);
console.log("Condition success counts:", plain.result.condCount);
console.log("Rule results:", plain.result.ruleResults);
console.log("Overall passed:", plain.result.passed);
console.log();

// Example 2: Using TestConditionsArray
console.log("--- TestConditionsArray input ---");
const tcArray = new TestConditionsArray(
  [
    { testType: TestType.AtLeast, target: 5 },
    { testType: TestType.InList, values: [1, 6] },
  ],
  DieType.D6,
);

const fromArray = rollDiceTest(DieType.D6, tcArray, {
  count: 4,
  rules: [
    { type: "condition_count", conditionIndex: 0, atLeast: 2 },
    { type: "value_count", value: 6, atLeast: 1 },
  ],
});

console.log("Base rolls:", fromArray.base.array, "sum:", fromArray.base.sum);
console.log("Value counts:", fromArray.result.valueCounts);
console.log("Rule results:", fromArray.result.ruleResults);
console.log("Overall passed:", fromArray.result.passed);
console.log();

// Example 3: Reusing a DiceTestConditions instance
console.log("--- DiceTestConditions instance input ---");
const dtc = new DiceTestConditions({
  count: 3,
  dieType: DieType.D8,
  conditions: [{ testType: TestType.AtLeast, target: 6 }],
  rules: [{ type: "condition_count", conditionIndex: 0, atLeast: 2 }],
});

const fromInstance = rollDiceTest(DieType.D8, dtc, { count: 3 });
console.log(
  "Base rolls:",
  fromInstance.base.array,
  "sum:",
  fromInstance.base.sum,
);
console.log("Condition success counts:", fromInstance.result.condCount);
console.log("Rule results:", fromInstance.result.ruleResults);
console.log("Overall passed:", fromInstance.result.passed);
