/**
 * @module @platonic-dice/core/src/rollDiceModTest
 * @description
 * Rolls multiple dice with modifiers and evaluates each die against test conditions.
 * Builds on {@link rollDiceMod} and {@link DiceTestConditions}.
 *
 * Notes:
 * - Only per-die (`each`) modifiers affect test evaluation.
 * - Net (`net`) modifiers only affect the returned modified total.
 */

const entities = require("./entities");
const {
  isValidDieType,
  DiceTestConditions,
  TestConditionsArray,
  normaliseRollModifier,
  RollModifier,
} = entities;
const { rollDiceMod } = require("./rollDiceMod.js");

/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/RollModifier").RollModifierLike} RollModifierLike
 * @typedef {import("./entities/TestConditions").TestConditionsLike} TestConditionsLike
 */

/**
 * Roll multiple dice with modifiers and evaluate them against conditions.
 *
 * @param {DieTypeValue} dieType
 * @param {RollModifierLike} modifier
 * @param {import("./entities").DiceTestConditions|import("./entities/TestConditionsArray").TestConditionsArray|Array<TestConditionsLike>} conditions
 * @param {{ count?: number, rules?: Array<{ type: "value_count"|"condition_count", value?: number, conditionIndex?: number, exact?: number, atLeast?: number, atMost?: number }>, useNaturalCrits?: boolean }} [options={}]
 *
 * @returns {{ base: { array: number[], sum: number }, modified: { each: { array: number[], sum: number }, net: { value: number } }, result: Object }}
 */
function rollDiceModTest(
  dieType,
  modifier,
  conditions,
  { count = 1, rules = [], useNaturalCrits = undefined } = {},
) {
  if (!isValidDieType(dieType))
    throw new TypeError(`Invalid die type: ${dieType}`);
  if (!modifier) throw new TypeError("modifier is required");
  if (typeof count !== "number" || !Number.isInteger(count) || count < 1) {
    throw new TypeError("count must be a positive integer");
  }

  // Construct or validate provided DiceTestConditions
  /** @type {import("./entities").DiceTestConditions} */
  let dtc;
  if (conditions instanceof DiceTestConditions) {
    dtc = conditions;
    if (dtc.count !== count)
      throw new TypeError(
        "Provided DiceTestConditions count does not match requested count",
      );
  } else if (
    conditions instanceof TestConditionsArray ||
    Array.isArray(conditions)
  ) {
    dtc = new DiceTestConditions({ count, conditions, rules, dieType });
  } else {
    throw new TypeError(
      "conditions must be a DiceTestConditions instance, TestConditionsArray, or an array of TestConditions-like objects",
    );
  }

  // Normalise the per-die modifier for evaluation
  let eachMod;
  if (modifier instanceof RollModifier || typeof modifier === "function") {
    // Single modifier is net-only; per-die is identity
    eachMod = normaliseRollModifier(undefined);
  } else if (typeof modifier === "object" && modifier !== null) {
    eachMod = normaliseRollModifier(modifier.each);
  } else {
    throw new TypeError(
      `Invalid modifier: ${modifier}. Must be a function, RollModifier, or object.`,
    );
  }

  // Roll and apply modifiers
  const { base, modified } = rollDiceMod(dieType, modifier, { count });

  // Evaluate base rolls with per-die modifier applied
  const evaluator = dtc.toEvaluator(eachMod, useNaturalCrits);
  const result = evaluator(base.array);

  return { base, modified, result };
}

module.exports = {
  rollDiceModTest,
};
