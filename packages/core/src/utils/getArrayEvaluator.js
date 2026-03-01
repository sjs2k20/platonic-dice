/**
 * @module @platonic-dice/core/src/utils/getArrayEvaluator
 * @description
 * Builds an evaluator function for a `TestConditionsArray` that maps a single
 * numeric input to an array of outcomes (one per contained TestConditions).
 */

const { getEvaluator } = require("./getEvaluator");

/**
 * @typedef {import("../entities/TestConditions").TestConditionsInstance} TestConditionsInstance
 * @typedef {import("../entities/TestConditions").TestConditionsLike} TestConditionsLike
 * @typedef {import("../entities/TestConditionsArray").TestConditionsArray} TestConditionsArrayInstance
 * @typedef {import("../entities/Outcome").OutcomeValue} OutcomeValue
 */

/**
 * Create an evaluator for a TestConditionsArray instance.
 *
 * @param {TestConditionsArrayInstance} tcArray - The TestConditionsArray instance
 * @param {import("../entities/RollModifier").RollModifierInstance} [modifier]
 * @param {boolean} [useNaturalCrits]
 * @returns {(value: number) => OutcomeValue[]} Function mapping numeric value -> array of Outcome values
 */
function getArrayEvaluator(
  tcArray,
  modifier = undefined,
  useNaturalCrits = undefined,
) {
  if (!tcArray) throw new TypeError("tcArray is required");

  if (typeof tcArray.toArray !== "function") {
    throw new TypeError("tcArray must be a TestConditionsArray instance");
  }

  const conditions = tcArray.toArray();

  // Build per-entry evaluators using existing getEvaluator (reuses createOutcomeMap cache)
  const perEntryEvaluators = conditions.map(
    /** @param {TestConditionsInstance} tc */ (tc) =>
      getEvaluator(tc.dieType, tc, modifier, useNaturalCrits),
  );

  return /** @param {number} value */ (value) =>
    perEntryEvaluators.map(
      /** @param {(n:number)=>any} fn */ (fn) => fn(value),
    );
}

module.exports = {
  getArrayEvaluator,
};
