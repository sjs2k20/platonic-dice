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
 * @typedef {import("../entities/TestConditionsArray").TestConditionsArrayInstance} TestConditionsArrayInstance
 */

/**
 * Create an evaluator for a TestConditionsArray instance.
 *
 * @param {TestConditionsArrayInstance} tcArray - The TestConditionsArray instance
 * @param {import("../entities/RollModifier").RollModifierInstance|null} [modifier=null]
 * @param {boolean|null} [useNaturalCrits=null]
 * @returns {(value: number) => string[]} Function mapping numeric value -> array of Outcome values
 */
function getArrayEvaluator(tcArray, modifier = null, useNaturalCrits = null) {
  if (!tcArray) throw new TypeError("tcArray is required");

  if (typeof tcArray.toArray !== "function") {
    throw new TypeError("tcArray must be a TestConditionsArray instance");
  }

  const conditions = tcArray.toArray();

  // Build per-entry evaluators using existing getEvaluator (reuses createOutcomeMap cache)
  const perEntryEvaluators = conditions.map((tc) =>
    getEvaluator(tc.dieType, tc, modifier, useNaturalCrits),
  );

  return /** @param {number} value */ (value) =>
    perEntryEvaluators.map((fn) => fn(value));
}

module.exports = {
  getArrayEvaluator,
};
