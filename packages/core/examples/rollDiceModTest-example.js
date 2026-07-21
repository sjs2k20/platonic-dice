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
console.log(
  "Description:\nRoll 4d6, apply +1 to each die, then +2 to the final sum.",
);
console.log(
  "Method Call:\nrollDiceMod(DieType.D6, { each: (n) => n + 1, net: (sum) => sum + 2 }, { count: 4 })",
);
console.log("Output:");
const modOnlyModifier = { each: (n) => n + 1, net: (sum) => sum + 2 };
const modOnlyOptions = { count: 4 };
const modOnly = rollDiceMod(DieType.D6, modOnlyModifier, modOnlyOptions);
console.log("\tBase:", modOnly.base.array, "sum:", modOnly.base.sum);
console.log("\tEach modified:", modOnly.modified.each.array);
console.log("\tNet total:", modOnly.modified.net.value);
console.log();

console.log("--- rollDiceTest() evaluates aggregate rules ---");
console.log(
  "Description:\nRoll 4d6, test each die against conditions '[at least 4, exactly 6]', then require at least 2 passes of condition[0] (at least 4) and at least one raw 6.",
);
console.log(
  'Method Call:\nrollDiceTest(DieType.D6, [{ testType: TestType.AtLeast, target: 4 }, { testType: TestType.Exact, target: 6 }], { count: 4, rules: [{ type: "condition_count", conditionIndex: 0, atLeast: 2 }, { type: "value_count", value: 6, atLeast: 1 }] })',
);
console.log("Output:");
const testOnlyConditions = [
  { testType: TestType.AtLeast, target: 4 },
  { testType: TestType.Exact, target: 6 },
];
const testOnlyOptions = {
  count: 4,
  rules: [
    { type: "condition_count", conditionIndex: 0, atLeast: 2 },
    { type: "value_count", value: 6, atLeast: 1 },
  ],
};
const testOnly = rollDiceTest(DieType.D6, testOnlyConditions, testOnlyOptions);
console.log("\tBase:", testOnly.base.array, "sum:", testOnly.base.sum);
console.log("\tCondition success counts:", testOnly.result.condCount);
console.log("\tRule results:", testOnly.result.ruleResults);
console.log("\tOverall passed:", testOnly.result.passed);
console.log();

console.log("--- rollDiceModTest() combines both ---");
console.log(
  "Description:\nRoll 4d6, apply +1 each and +2 net, test modified per-die values against conditions '[at least 5, exactly 6]', and require condition[0] (at least 5) >= 2 and condition[1] (exactly 6)>= 1.",
);
console.log(
  'Method Call:\nrollDiceModTest(DieType.D6, { each: (n) => n + 1, net: (sum) => sum + 2 }, [{ testType: TestType.AtLeast, target: 5 }, { testType: TestType.Exact, target: 6 }], { count: 4, rules: [{ type: "condition_count", conditionIndex: 0, atLeast: 2 }, { type: "condition_count", conditionIndex: 1, atLeast: 1 }] })',
);
console.log("Output:");
const combinedModifier = {
  each: (n) => n + 1,
  net: (sum) => sum + 2,
};
const combinedConditions = [
  { testType: TestType.AtLeast, target: 5 },
  { testType: TestType.Exact, target: 6 },
];
const combinedOptions = {
  count: 4,
  rules: [
    { type: "condition_count", conditionIndex: 0, atLeast: 2 },
    { type: "condition_count", conditionIndex: 1, atLeast: 1 },
  ],
};
const combined = rollDiceModTest(
  DieType.D6,
  combinedModifier,
  combinedConditions,
  combinedOptions,
);
console.log("\tBase:", combined.base.array, "sum:", combined.base.sum);
console.log("\tModified each:", combined.modified.each.array);
console.log("\tModified net:", combined.modified.net.value);
console.log("\tCondition success counts:", combined.result.condCount);
console.log("\tRule results:", combined.result.ruleResults);
console.log("\tOverall passed:", combined.result.passed);
console.log();

console.log("=== Input Variants ===\n");

console.log("--- Using TestConditionsArray as conditions input ---");
console.log(
  "Description:\nBuild TestConditionsArray for conditions '[at least 4, in-list 1 or 6]', roll 5d6, apply +1 each, and require condition[0] >= 3.",
);
console.log(
  'Method Call:\nrollDiceModTest(DieType.D6, { each: (n) => n + 1 }, tcArray, { count: 5, rules: [{ type: "condition_count", conditionIndex: 0, atLeast: 3 }] })',
);
console.log("Output:");
const tcArray = new TestConditionsArray(
  [
    { testType: TestType.AtLeast, target: 4 },
    { testType: TestType.InList, values: [1, 6] },
  ],
  DieType.D6,
);

const fromArrayModifier = { each: (n) => n + 1 };
const fromArrayOptions = {
  count: 5,
  rules: [{ type: "condition_count", conditionIndex: 0, atLeast: 3 }],
};

const fromArray = rollDiceModTest(
  DieType.D6,
  fromArrayModifier,
  tcArray,
  fromArrayOptions,
);

console.log("\tBase:", fromArray.base.array, "sum:", fromArray.base.sum);
console.log("\tModified each:", fromArray.modified.each.array);
console.log("\tCondition success counts:", fromArray.result.condCount);
console.log("\tOverall passed:", fromArray.result.passed);
console.log();

console.log("--- Reusing a DiceTestConditions instance ---");
console.log(
  "Description:\nReuse a DiceTestConditions instance configured for 3d8 with [at least 6], require condition[0] >= 2, and apply +1 each with +3 net.",
);
console.log(
  "Method Call:\nrollDiceModTest(DieType.D8, { each: (n) => n + 1, net: (sum) => sum + 3 }, dtc, { count: 3 })",
);
console.log("Output:");
const dtc = new DiceTestConditions({
  count: 3,
  dieType: DieType.D8,
  conditions: [{ testType: TestType.AtLeast, target: 6 }],
  rules: [{ type: "condition_count", conditionIndex: 0, atLeast: 2 }],
});

const fromInstanceModifier = { each: (n) => n + 1, net: (sum) => sum + 3 };
const fromInstanceOptions = { count: 3 };

const fromInstance = rollDiceModTest(
  DieType.D8,
  fromInstanceModifier,
  dtc,
  fromInstanceOptions,
);

console.log("\tBase:", fromInstance.base.array, "sum:", fromInstance.base.sum);
console.log("\tModified each:", fromInstance.modified.each.array);
console.log("\tModified net:", fromInstance.modified.net.value);
console.log("\tCondition success counts:", fromInstance.result.condCount);
console.log("\tRule results:", fromInstance.result.ruleResults);
console.log("\tOverall passed:", fromInstance.result.passed);
console.log();

console.log("=== Net-Only Modifier Note ===\n");
console.log(
  "Passing a single function is net-only: aggregate tests still evaluate per-die values (no per-die adjustment).",
);
console.log(
  "Description:\nRoll 4d6, apply net-only +5 (no per-die adjustment), test at least 4 per die, and require condition[0] >= 2.",
);
console.log(
  'Method Call:\nrollDiceModTest(DieType.D6, (sum) => sum + 5, [{ testType: TestType.AtLeast, target: 4 }], { count: 4, rules: [{ type: "condition_count", conditionIndex: 0, atLeast: 2 }] })',
);
console.log("Output:");
const netOnlyModifier = (sum) => sum + 5;
const netOnlyConditions = [{ testType: TestType.AtLeast, target: 4 }];
const netOnlyOptions = {
  count: 4,
  rules: [{ type: "condition_count", conditionIndex: 0, atLeast: 2 }],
};
const netOnly = rollDiceModTest(
  DieType.D6,
  netOnlyModifier,
  netOnlyConditions,
  netOnlyOptions,
);
console.log("\tBase:", netOnly.base.array, "sum:", netOnly.base.sum);
console.log("\tModified net:", netOnly.modified.net.value);
console.log("\tCondition success counts:", netOnly.result.condCount);
console.log("\tOverall passed:", netOnly.result.passed);
