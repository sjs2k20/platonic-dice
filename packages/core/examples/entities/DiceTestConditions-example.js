/**
 * Example usage of DiceTestConditions
 * Demonstrates aggregate, rule-based evaluation across multiple dice.
 */

const {
  DiceTestConditions,
  TestConditionsArray,
  TestType,
  DieType,
  rollDiceTest,
} = require("../../src");

console.log("=== DiceTestConditions Examples ===\n");

// Example 1: Build aggregate rules
console.log("--- Constructing DiceTestConditions ---");
const tcArray = new TestConditionsArray(
  [
    { testType: TestType.AtLeast, target: 4 },
    { testType: TestType.Exact, target: 6 },
  ],
  DieType.D6,
);

const aggregate = new DiceTestConditions({
  count: 4,
  conditions: tcArray,
  rules: [
    { type: "condition_count", conditionIndex: 0, atLeast: 2 },
    { type: "value_count", value: 6, atLeast: 1 },
  ],
});

console.log("Dice count:", aggregate.count);
console.log("Rule count:", aggregate.rules.length);
console.log();

// Example 2: Evaluate a fixed roll set deterministically
console.log("--- evaluateRolls([...]) ---");
const fixedRolls = [6, 5, 2, 1];
const evaluated = aggregate.evaluateRolls(fixedRolls);

console.log("Input rolls:", fixedRolls);
console.log("Matrix (die -> outcomes):", evaluated.matrix);
console.log("Condition success counts:", evaluated.condCount);
console.log("Value counts:", evaluated.valueCounts);
console.log("Rule results:", evaluated.ruleResults);
console.log("Overall passed:", evaluated.passed);
console.log();

// Example 3: Use with rollDiceTest
console.log("--- Integration with rollDiceTest ---");
const rolled = rollDiceTest(DieType.D6, aggregate, { count: 4 });

console.log("Rolled dice:", rolled.base.array, "sum:", rolled.base.sum);
console.log("Condition success counts:", rolled.result.condCount);
console.log("Rule results:", rolled.result.ruleResults);
console.log("Overall passed:", rolled.result.passed);
