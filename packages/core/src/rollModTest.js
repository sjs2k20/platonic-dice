/**
 * @module @platonic-dice/core/src/rollModTest
 * @description
 * Rolls a die with a modifier and evaluates the modified result against test conditions.
 * Combines the logic of {@link rollMod} and {@link rollTest}.
 *
 * @example
 * import { rollModTest, TestType, DieType } from "@platonic-dice/core";
 *
 * // Roll a D20 with +5 bonus, check if result ≥ 15
 * const result = rollModTest(
 *   DieType.D20,
 *   (n) => n + 5,
 *   { testType: TestType.AtLeast, target: 15 }
 * );
 * console.log(result.base);      // e.g., 12
 * console.log(result.modified);  // e.g., 17
 * console.log(result.outcome);   // e.g., "success"
 *
 * @example
 * // Skill check with advantage and modifier
 * const result = rollModTest(
 *   DieType.D20,
 *   new RollModifier((n) => n + 3),
 *   { testType: TestType.Skill, target: 12, critical_success: 20, critical_failure: 1 },
 *   RollType.Advantage
 * );
 */

const { normaliseRollModifier } = require("./entities");
const { ModifiedTestConditions } = require("./entities/ModifiedTestConditions");
const r = require("./roll.js");
const utils = require("./utils");
const { createOutcomeMap } = require("./utils/outcomeMapper");
const { numSides } = require("./utils");

/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/Outcome").OutcomeValue} OutcomeValue
 * @typedef {import("./entities/RollType").RollTypeValue} RollTypeValue
 * @typedef {import("./entities/RollModifier").RollModifierFunction} RollModifierFunction
 * @typedef {import("./entities/RollModifier").RollModifierInstance} RollModifierInstance
 * @typedef {import("./entities/TestType").TestTypeValue} TestTypeValue
 * @typedef {import("./entities/TestConditions").TestConditionsInstance} TestConditionsInstance
 */

/**
 * Helper to rank outcomes for comparison.
 * @private
 * @param {OutcomeValue} outcome
 * @returns {number}
 */
function rankOutcome(outcome) {
  const { Outcome } = require("./entities");
  switch (outcome) {
    case Outcome.CriticalFailure:
      return 0;
    case Outcome.Failure:
      return 1;
    case Outcome.Success:
      return 2;
    case Outcome.CriticalSuccess:
      return 3;
    default:
      return 1; // Default to failure rank
  }
}

/**
 * Rolls a die with a modifier and evaluates the modified result against test conditions.
 *
 * @function rollModTest
 * @param {DieTypeValue} dieType - The type of die to roll (e.g., `DieType.D20`).
 * @param {RollModifierFunction|RollModifierInstance} modifier - The modifier to apply to the roll.
 *   Can be either:
 *   - A function `(n: number) => number`
 *   - A {@link RollModifier} instance
 * @param {TestConditionsInstance|{ testType: TestTypeValue, [key: string]: any }} testConditions
 *   Can be:
 *   - A `TestConditions` instance
 *   - A plain object `{ testType, ...conditions }`
 * @param {RollTypeValue} [rollType=undefined] - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @param {Object} [options={}] - Optional configuration.
 * @param {boolean} [options.useNaturalCrits] - If true, natural max/min rolls on the die trigger
 *   critical success/failure (for Skill tests) or success/failure (for other test types).
 *   If undefined, defaults to true for Skill test type and false for all others.
 * @returns {{ base: number, modified: number, outcome: OutcomeValue }}
 *   - `base`: The raw die roll
 *   - `modified`: The roll after applying the modifier
 *   - `outcome`: The success/failure result based on test conditions
 * @throws {TypeError} If `dieType`, `modifier`, or `testConditions` are invalid.
 *
 * @example
 * const result = rollModTest(
 *   DieType.D20,
 *   (n) => n + 2,
 *   { testType: TestType.AtLeast, target: 15 }
 * );
 * console.log(result); // { base: 14, modified: 16, outcome: "success" }
 *
 * @example
 * // With natural crits enabled (TTRPG style)
 * const result = rollModTest(
 *   DieType.D20,
 *   (n) => n + 5,
 *   { testType: TestType.Skill, target: 15, critical_success: 25, critical_failure: 2 },
 *   undefined,
 *   { useNaturalCrits: true }
 * );
 * // If base roll is 20, outcome is always "critical_success"
 * // If base roll is 1, outcome is always "critical_failure"
 *
 * @example
 * // With advantage - compares outcomes, not just base rolls
 * const result = rollModTest(
 *   DieType.D20,
 *   (n) => n + 3,
 *   { testType: TestType.Skill, target: 12, critical_success: 20, critical_failure: 1 },
 *   RollType.Advantage
 * );
 * // Rolls twice, returns the result with the better outcome
 */
function rollModTest(
  dieType,
  modifier,
  testConditions,
  rollType = undefined,
  options = {}
) {
  if (!dieType) throw new TypeError("dieType is required.");
  if (!modifier) throw new TypeError("modifier is required.");
  if (!testConditions) throw new TypeError("testConditions is required.");

  // Normalise the modifier (skip if already a RollModifier instance)
  const { RollModifier } = require("./entities");
  const mod =
    modifier instanceof RollModifier
      ? modifier
      : normaliseRollModifier(modifier);

  // Create ModifiedTestConditions if input is a plain object
  let conditionSet;
  if (testConditions instanceof ModifiedTestConditions) {
    conditionSet = testConditions;
  } else {
    // Plain object: { testType, ...conditions }
    const { testType, ...rest } = testConditions;
    // @ts-ignore - rest is validated by ModifiedTestConditions constructor
    conditionSet = new ModifiedTestConditions(testType, rest, dieType, mod);
  }

  // Create outcome map for all possible rolls (with modifier applied)
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
        // @ts-ignore - ModifiedTestConditions is compatible with TestConditions for outcome mapping
        conditionSet,
        mod,
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
      // @ts-ignore - ModifiedTestConditions is compatible with TestConditions for outcome mapping
      conditionSet,
      mod, // include modifier
      options.useNaturalCrits
    );
  }

  // Handle advantage/disadvantage by comparing outcomes
  if (rollType) {
    const { RollType } = require("./entities");

    // Roll twice
    const roll1 = utils.generateResult(dieType);
    const roll2 = utils.generateResult(dieType);

    // Look up outcomes from pre-computed map
    const outcome1 = outcomeMap[roll1];
    const outcome2 = outcomeMap[roll2];

    // Build result objects
    const result1 = {
      base: roll1,
      modified: mod.apply(roll1),
      outcome: outcome1,
    };
    const result2 = {
      base: roll2,
      modified: mod.apply(roll2),
      outcome: outcome2,
    };

    // Compare outcomes: higher rank is better
    const rank1 = rankOutcome(outcome1);
    const rank2 = rankOutcome(outcome2);

    if (rollType === RollType.Advantage) {
      // Return the result with better outcome (higher rank)
      return rank1 >= rank2 ? result1 : result2;
    } else {
      // Disadvantage: return the result with worse outcome (lower rank)
      return rank1 <= rank2 ? result1 : result2;
    }
  }

  // Normal roll (no advantage/disadvantage)
  const base = r.roll(dieType);
  const outcome = outcomeMap[base];
  const modified = mod.apply(base);

  return { base, modified, outcome };
}

module.exports = {
  rollModTest,
};
