/**
 * @module @platonic-dice/core/src/utils/getEvaluator
 * @description
 * Helper to obtain a per-base evaluator for a given die + conditions.
 *
 * It first consults the `testRegistry` for a `buildEvaluator`. If none is
 * registered, it falls back to building an outcome map via
 * `createOutcomeMap` and returns a function that indexes into that map.
 */

const { createOutcomeMap } = require("./outcomeMapper");
const { numSides } = require("./generateResult");

/**
 * @typedef {import("../entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("../entities/TestType").TestTypeValue} TestTypeValue
 * @typedef {import("../entities/Outcome").OutcomeValue} OutcomeValue
 * @typedef {import("../entities/TestConditions").TestConditionsInstance} TestConditionsInstance
 * @typedef {(base: number) => OutcomeValue} Evaluator
 */

/**
 * Get an evaluator function mapping base roll -> OutcomeValue.
 *
 * @typedef {import("../entities/TestConditions").TestConditionsLike} TestConditionsLike
 * @param {DieTypeValue} dieType
 * @param {TestConditionsLike} testConditions
 * @param {import("../entities/RollModifier").RollModifierInstance} [modifier]
 * @param {boolean} [useNaturalCrits]
 * @returns {Evaluator}
 */
function getEvaluator(
  dieType,
  testConditions,
  modifier = undefined,
  useNaturalCrits = undefined,
) {
  if (!testConditions || !testConditions.testType) {
    throw new TypeError(
      "testConditions must include a 'testType' field or be a TestConditions instance",
    );
  }

  const { getRegistration } = require("./testRegistry");

  const testType = testConditions.testType;
  const reg = getRegistration(testType);
  if (reg && typeof reg.buildEvaluator === "function") {
    return reg.buildEvaluator(
      dieType,
      testConditions,
      modifier,
      useNaturalCrits,
    );
  }

  // Fallback: build an outcome map and return a simple indexer
  // Ensure we pass a TestConditions instance into createOutcomeMap to match
  // its runtime/typing contract. Normalise plain objects when necessary.
  const {
    TestConditions,
    normaliseTestConditions,
  } = require("../entities/TestConditions");
  let tcInstance = testConditions;
  if (!(testConditions instanceof TestConditions)) {
    // Runtime normalization: `normaliseTestConditions` will validate and return a
    // `TestConditions` instance when given a plain object.
    tcInstance = normaliseTestConditions(testConditions, dieType);
  }

  const outcomeMap = createOutcomeMap(
    dieType,
    testType,
    // `tcInstance` is a validated TestConditions instance at runtime
    tcInstance,
    modifier,
    useNaturalCrits,
  );
  return /** @param {number} base */ (base) => outcomeMap[base];
}

module.exports = {
  getEvaluator,
};
