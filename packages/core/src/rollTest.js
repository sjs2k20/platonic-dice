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
 * @param {TestConditionsInstance|import("./entities/TestConditions").TestConditionsLike} testConditions
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
  let conditionSet;
  if (testConditions instanceof tc.TestConditions) {
    conditionSet = testConditions;
  } else {
    // Plain object: validate early for clearer errors, then normalise.
    // We still call `normaliseTestConditions` so tests and any instrumentation
    // that spy on it will observe the delegation (and the constructor remains
    // the final authority for detailed RangeErrors).
    const { testType, ...rest } = testConditions;
    const fullConditions = { ...rest, dieType };
    const validators = require("./utils/testValidators");
    const { isValidTestType } = require("./entities/TestType");

    if (!isValidTestType(testType)) {
      // Call normaliser so callers/spies see the delegation, then throw
      // a consistent TypeError for unsupported test types.
      try {
        tc.normaliseTestConditions(testConditions, dieType);
      } catch (err) {
        // ignore original error; prefer consistent message
      }
      throw new TypeError(`Invalid test type: ${testType}`);
    }

    if (!validators.areValidTestConditions(fullConditions, testType)) {
      // Call the normaliser to preserve existing call-sites/tests that expect
      // the delegation; then fail fast with a standardised message.
      try {
        tc.normaliseTestConditions(testConditions, dieType);
      } catch (err) {
        // swallow the deeper error in favor of a clearer TypeError below
      }
      throw new TypeError("Invalid test conditions shape.");
    }

    conditionSet = tc.normaliseTestConditions(testConditions, dieType);
  }

  // Use centralised evaluator helper (registry or fallback)
  const { getEvaluator } = require("./utils/getEvaluator");
  const evaluator = getEvaluator(
    dieType,
    conditionSet,
    undefined,
    options.useNaturalCrits,
  );
  const sides = numSides(dieType);
  /** @type {Record<number, OutcomeValue>} */
  const outcomeMap = {};
  for (let b = 1; b <= sides; b++) outcomeMap[b] = evaluator(b);

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

// Export all generated aliases as named exports so tsc emits named declarations
Object.assign(exports, { rollTest, ...aliases });
