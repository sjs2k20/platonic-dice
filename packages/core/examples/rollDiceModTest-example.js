/**
 * Example usage of rollDiceModTest
 * Demonstrates combining dice modifiers with aggregate test evaluation.
 */

const {
  rollDiceMod,
  rollDiceTest,
  rollDiceModTest,
  DiceTestConditions,
  TestConditionsArray,
  DieType,
  TestType,
} = require("../src");

console.log("=== How rollDiceModTest Builds on Other Functions ===\n");

console.log("--- rollDiceMod() returns base + modified totals ---");
const modOnly = rollDiceMod(
  DieType.D6,
  { each: (n) => n + 1, net: (sum) => sum + 2 },
  { count: 4 },
);
console.log("Base:", modOnly.base.array, "sum:", modOnly.base.sum);
console.log("Each modified:", modOnly.modified.each.array);
console.log("Net total:", modOnly.modified.net.value);
console.log();

console.log("--- rollDiceTest() evaluates aggregate rules ---");
const testOnly = rollDiceTest(
  DieType.D6,
  [
    { testType: TestType.AtLeast, target: 4 },
    { testType: TestType.Exact, target: 6 },
  ],
  {
    count: 4,
    rules: [
      { type: "condition_count", conditionIndex: 0, atLeast: 2 },
      { type: "value_count", value: 6, atLeast: 1 },
    ],
  },
);
console.log("Base:", testOnly.base.array, "sum:", testOnly.base.sum);
console.log("Condition success counts:", testOnly.result.condCount);
console.log("Rule results:", testOnly.result.ruleResults);
console.log("Overall passed:", testOnly.result.passed);
console.log();

console.log("--- rollDiceModTest() combines both ---");
const combined = rollDiceModTest(
  DieType.D6,
  {
    each: (n) => n + 1,
    net: (sum) => sum + 2,
  },
  [
    { testType: TestType.AtLeast, target: 5 },
    { testType: TestType.Exact, target: 6 },
  ],
  {
    count: 4,
    rules: [
      { type: "condition_count", conditionIndex: 0, atLeast: 2 },
      { type: "condition_count", conditionIndex: 1, atLeast: 1 },
    ],
  },
);
console.log("Base:", combined.base.array, "sum:", combined.base.sum);
console.log("Modified each:", combined.modified.each.array);
console.log("Modified net:", combined.modified.net.value);
console.log("Condition success counts:", combined.result.condCount);
console.log("Rule results:", combined.result.ruleResults);
console.log("Overall passed:", combined.result.passed);
console.log();

console.log("=== Input Variants ===\n");

console.log("--- Using TestConditionsArray as conditions input ---");
const tcArray = new TestConditionsArray(
  [
    { testType: TestType.AtLeast, target: 4 },
    { testType: TestType.InList, values: [1, 6] },
  ],
  DieType.D6,
);

const fromArray = rollDiceModTest(DieType.D6, { each: (n) => n + 1 }, tcArray, {
  count: 5,
  rules: [{ type: "condition_count", conditionIndex: 0, atLeast: 3 }],
});

console.log("Base:", fromArray.base.array, "sum:", fromArray.base.sum);
console.log("Modified each:", fromArray.modified.each.array);
console.log("Condition success counts:", fromArray.result.condCount);
console.log("Overall passed:", fromArray.result.passed);
console.log();

console.log("--- Reusing a DiceTestConditions instance ---");
const dtc = new DiceTestConditions({
  count: 3,
  dieType: DieType.D8,
  conditions: [{ testType: TestType.AtLeast, target: 6 }],
  rules: [{ type: "condition_count", conditionIndex: 0, atLeast: 2 }],
});

const fromInstance = rollDiceModTest(
  DieType.D8,
  { each: (n) => n + 1, net: (sum) => sum + 3 },
  dtc,
  { count: 3 },
);

console.log("Base:", fromInstance.base.array, "sum:", fromInstance.base.sum);
console.log("Modified each:", fromInstance.modified.each.array);
console.log("Modified net:", fromInstance.modified.net.value);
console.log("Condition success counts:", fromInstance.result.condCount);
console.log("Rule results:", fromInstance.result.ruleResults);
console.log("Overall passed:", fromInstance.result.passed);
console.log();

console.log("=== Net-Only Modifier Note ===\n");
console.log(
  "Passing a single function is net-only: aggregate tests still evaluate per-die values (no per-die adjustment).",
);
const netOnly = rollDiceModTest(
  DieType.D6,
  (sum) => sum + 5,
  [{ testType: TestType.AtLeast, target: 4 }],
  {
    count: 4,
    rules: [{ type: "condition_count", conditionIndex: 0, atLeast: 2 }],
  },
);
console.log("Base:", netOnly.base.array, "sum:", netOnly.base.sum);
console.log("Modified net:", netOnly.modified.net.value);
console.log("Condition success counts:", netOnly.result.condCount);
console.log("Overall passed:", netOnly.result.passed);
