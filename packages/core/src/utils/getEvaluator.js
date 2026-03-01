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
  const {
    TestConditions,
    normaliseTestConditions,
  } = require("../entities/TestConditions");
  const {
    ModifiedTestConditions,
  } = require("../entities/ModifiedTestConditions");

  const testType = testConditions.testType;
  const reg = getRegistration(testType);
  if (reg && typeof reg.buildEvaluator === "function") {
    // Construct the exact conditions instance the registry should receive.
    // Under Option B, registry accepts plain `TestConditions`. For
    // modifier-aware analysis we construct `ModifiedTestConditions` here and
    // pass that through; otherwise normalise to `TestConditions`.
    let toPass = testConditions;
    if (!(testConditions instanceof TestConditions)) {
      if (testConditions instanceof ModifiedTestConditions) {
        toPass = testConditions;
      } else if (modifier == null) {
        toPass = normaliseTestConditions(testConditions, dieType);
      } else {
        // Build a ModifiedTestConditions for modifier-aware evaluation
        toPass = new ModifiedTestConditions(
          testType,
          testConditions,
          dieType,
          modifier,
        );
      }
    }

    return reg.buildEvaluator(
      dieType,
      /** @type {import("./testValidators").Conditions} */ (
        /** @type {unknown} */ (toPass)
      ),
      modifier,
      useNaturalCrits,
    );
  }

  // Fallback: build an outcome map and return a simple indexer
  // Ensure we pass a TestConditions instance into createOutcomeMap to match
  // its runtime/typing contract. Normalise plain objects when necessary.
  let tcInstance = testConditions;
  if (!(testConditions instanceof TestConditions)) {
    if (testConditions instanceof ModifiedTestConditions) {
      tcInstance = testConditions;
    } else if (modifier == null) {
      // Normalise into base TestConditions
      tcInstance = normaliseTestConditions(testConditions, dieType);
    } else {
      // Construct ModifiedTestConditions when modifier is present
      tcInstance = new ModifiedTestConditions(
        testType,
        testConditions,
        dieType,
        modifier,
      );
    }
  }

  const outcomeMap = createOutcomeMap(
    dieType,
    testType,
    // `tcInstance` is a validated TestConditions instance at runtime
    /** @type {TestConditionsInstance} */ (tcInstance),
    modifier,
    useNaturalCrits,
  );
  return /** @param {number} base */ (base) => outcomeMap[base];
}

module.exports = {
  getEvaluator,
};
