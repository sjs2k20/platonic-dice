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
const { createOutcomeMap } = require("./utils/outcomeMapper");
const { numSides } = require("./utils");

/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/Outcome").OutcomeValue} OutcomeValue
 * @typedef {import("./entities/RollType").RollTypeValue} RollTypeValue
 * @typedef {import("./entities/TestType").TestTypeValue} TestTypeValue
 * @typedef {import("./entities/TestConditions").TestConditionsInstance} TestConditionsInstance
 */

/**
 * @typedef {Object} RollTestOptions
 * @property {boolean} [useNaturalCrits] - If true, rolling the die's maximum value
 *   triggers CriticalSuccess (for Skill tests) or Success (for AtLeast/AtMost tests),
 *   and rolling 1 triggers CriticalFailure (for Skill tests) or Failure (for AtLeast)
 *   or Success (for AtMost). If undefined, defaults to true for TestType.Skill
 *   and false for all other test types.
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
 * @param {RollTestOptions} [options={}] - Optional configuration for natural crits
 * @returns {{ base: number, outcome: OutcomeValue }} The raw roll and its evaluated outcome.
 * @throws {TypeError} If `dieType` or `testConditions` are invalid.
 */
function rollTest(dieType, testConditions, rollType = undefined, options = {}) {
  if (!dieType) throw new TypeError("dieType is required.");

  // Normalise testConditions (skip if already a TestConditions instance)
  const conditionSet =
    testConditions instanceof tc.TestConditions
      ? testConditions
      : tc.normaliseTestConditions(testConditions, dieType);

  // Create outcome map for all possible rolls
  // Prefer registry evaluator if available; otherwise build outcome map.
  /** @type {Record<number, OutcomeValue>|undefined} */
  let outcomeMap;
  try {
    const { getRegistration } = require("./utils/testRegistry");
    const reg = getRegistration(conditionSet.testType);
    if (reg && typeof reg.buildEvaluator === "function") {
      /** @type {import("./utils/testRegistry").Evaluator} */
      const evaluator = reg.buildEvaluator(
        dieType,
        conditionSet,
        null,
        options.useNaturalCrits
      );
      outcomeMap = {};
      const sides = numSides(dieType);
      for (let b = 1; b <= sides; b++) outcomeMap[b] = evaluator(b);
    }
  } catch (err) {
    // fall through to legacy logic
  }

  if (!outcomeMap) {
    outcomeMap = createOutcomeMap(
      dieType,
      conditionSet.testType,
      conditionSet,
      null, // no modifier
      options.useNaturalCrits
    );
  }

  // Perform the roll
  const base = r.roll(dieType, rollType);

  // Look up outcome from pre-computed map
  const outcome = outcomeMap[base];

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
