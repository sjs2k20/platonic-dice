/**
 * @module @platonic-dice/core/src/rollTest
 * @description
 * Rolls a die and evaluates it against a set of test conditions.
 * Supports either a `TestConditions` instance or a plain object
 * with `{ testType, ...conditions }`.
 *
 * @example
 * import { rollTest, TestType, DieType, RollType } from "@platonic-dice/core";
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
const { DieType, TestType } = require("./entities");
const tc = require("./entities/TestConditions.js");
const r = require("./roll.js");
const utils = require("./utils");

/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/Outcome").OutcomeValue} OutcomeValue
 * @typedef {import("./entities/RollType").RollTypeValue} RollTypeValue
 * @typedef {import("./entities/TestType").TestTypeValue} TestTypeValue
 * @typedef {import("./entities/TestConditions").TestConditionsInstance} TestConditionsInstance
 */

/**
 * Rolls a die and evaluates it against specified test conditions.
 *
 * @function rollTest
 * @param {DieTypeValue} dieType - The type of die to roll (e.g., `DieType.D6`, `DieType.D20`).
 * @param {TestConditionsInstance|{ testType: TestTypeValue, [key: string]: any }} testConditions
 *   Can be:
 *   - A `TestConditions` instance.
 *   - A plain object `{ testType, ...conditions }`.
 * @param {RollTypeValue} [rollType=undefined] - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @returns {{ base: number, outcome: OutcomeValue }} The raw roll and its evaluated outcome.
 * @throws {TypeError} If `dieType` or `testConditions` are invalid.
 */
function rollTest(dieType, testConditions, rollType = undefined) {
  if (!dieType) throw new TypeError("dieType is required.");

  // Normalise testConditions
  const conditionSet = tc.normaliseTestConditions(testConditions, dieType);

  // Perform the roll
  const base = r.roll(dieType, rollType);

  // Determine the outcome using centralized logic
  const outcome = utils.determineOutcome(base, testConditions);

  return { base, outcome };
}

//
// --- Convenience Aliases ---
//

/**
 * Generates a DieType + TestType-specific alias for `rollTest`.
 *
 * @private
 * @param {DieTypeValue} dieType
 * @param {TestTypeValue} testType
 * @returns {(target: number, rollType?: RollTypeValue|undefined) => { base: number, outcome: OutcomeValue }}
 */
function alias(dieType, testType) {
  return (target, rollType = undefined) =>
    rollTest(dieType, { testType, target }, rollType);
}

/**
 * Container for all dynamically generated aliases.
 * @type {Record<string, (target: number, rollType?: RollTypeValue|undefined) => { base: number, outcome: OutcomeValue }>}
 */
const aliases = {};

// Dynamically generate aliases for all DieTypes × TestTypes
for (const [dieKey, dieValue] of Object.entries(DieType)) {
  for (const [testKey, testValue] of Object.entries(TestType)) {
    const aliasName = `roll${dieKey}${testKey}`; // e.g., rollD20AtLeast
    aliases[aliasName] = alias(dieValue, testValue);
  }
}

// Export all generated aliases
module.exports = {
  rollTest,
  ...aliases,
};
