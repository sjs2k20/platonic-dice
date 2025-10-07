/**
 * @module @dice/core/src/rollTest
 * @description
 * Rolls a die and evaluates it against a set of test conditions.
 * Supports either a `TestConditions` instance or a plain object
 * with `{ testType, ...conditions }`.
 *
 * @example
 * import { rollTest, TestType, DieType, RollType } from "@dice/core";
 *
 * // Basic "at least" test
 * const result = rollTest(DieType.D20, { testType: TestType.AtLeast, target: 15 });
 * console.log(result.base);     // e.g., 12
 * console.log(result.outcome);  // e.g., "failure"
 *
 * @example
 * // Roll with advantage
 * const resultAdv = rollTest(
 *   DieType.D20,
 *   { testType: TestType.AtMost, target: 5 },
 *   RollType.Advantage
 * );
 */
const {
  DieType,
  normaliseTestConditions,
  RollType,
  TestConditions,
} = require("./entities");
const { determineOutcome } = "./utils";
const { roll } = require("./roll.js");

/**
 * @typedef {import("./entities").DieType} DieType
 * @typedef {import("./entities").RollType} RollType
 * @typedef {import("./entities").TestConditions} TestConditions
 * @typedef {import("./entities").Outcome} Outcome
 */

/**
 * Rolls a die and evaluates it against specified test conditions.
 *
 * @function rollTest
 * @param {DieType} dieType - The type of die to roll (e.g., `DieType.D6`, `DieType.D20`).
 * @param {TestConditions|Object} testConditions - Conditions to evaluate the roll against.
 *   Can be:
 *   - A `TestConditions` instance.
 *   - A plain object `{ testType, ...conditions }`.
 * @param {RollType} [rollType=null] - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @returns {{ base: number, outcome: string }} The raw roll and its evaluated outcome.
 * @throws {TypeError} If `dieType` or `testConditions` are invalid.
 */
function rollTest(dieType, testConditions, rollType = null) {
  if (!dieType) throw new TypeError("dieType is required.");

  // Normalise testConditions
  const conditionSet = normaliseTestConditions(testConditions, dieType);

  // Perform the roll
  const base = roll(dieType, rollType);

  // Determine the outcome using centralized logic
  const outcome = determineOutcome(base, testConditions);

  return { base, outcome };
}

//
// --- Convenience Aliases ---
//

/**
 * Generates a DieType + TestType-specific alias for `rollTest`.
 *
 * @private
 * @param {DieType} dieType
 * @param {TestType} testType
 * @returns {function(number, RollType=): { base: number, outcome: string }}
 */
function alias(dieType, testType) {
  return (target, rollType = null) =>
    rollTest(dieType, { testType, target }, rollType);
}

/**
 * @type {Record<string, function(number, RollType=): { base: number, outcome: string }>}
 */
const aliases = {};

// Dynamically generate aliases for all DieTypes × TestTypes
for (const dieKey of Object.keys(DieType)) {
  const dieValue = DieType[dieKey];
  for (const testKey of Object.keys(TestType)) {
    const testValue = TestType[testKey];
    const aliasName = `roll${dieKey}${testKey}`; // e.g., rollD20AtLeast
    aliases[aliasName] = alias(dieValue, testValue);
  }
}

// Export all generated aliases
module.exports = {
  rollTest,
  rollD4AtLeast,
  rollD4AtMost,
  rollD4Exact,
  rollD6AtLeast,
  rollD6AtMost,
  rollD6Exact,
  rollD8AtLeast,
  rollD8AtMost,
  rollD8Exact,
  rollD10AtLeast,
  rollD10AtMost,
  rollD10Exact,
  rollD12AtLeast,
  rollD12AtMost,
  rollD12Exact,
  rollD20AtLeast,
  rollD20AtMost,
  rollD20Exact,
};
