/**
 * @module @dice/core/src/entities/normalisation/normaliseTestConditions
 * @description
 * Normalises any input into a {@link TestConditions} instance.
 *
 * Supports both pre-existing instances and plain objects.
 * Automatically validates all conditions for the specified die type.
 *
 * @example
 * // Passing a plain object
 * const conditions = normaliseTestConditions({ testType: 'atLeast', target: 4 }, 'd6');
 *
 * @example
 * // Passing an existing TestConditions instance
 * const existing = new TestConditions('exact', { target: 3 }, 'd6');
 * const conditions2 = normaliseTestConditions(existing, 'd6');
 */

const { TestConditions } = require("../../entities");

/**
 * @typedef {import("../..entities").DieType} DieType
 * @typedef {import("../..entities").TestConditions} TestConditions
 */

/**
 * @param {TestConditions | { testType: string, [key: string]: any }} tc
 *   A {@link TestConditions} instance or plain object with `testType` and other fields.
 * @param {DieType} dieType
 *   The die type (e.g., `'d6'`, `'d20'`) used for validation.
 * @returns {TestConditions}
 *   A validated {@link TestConditions} instance.
 * @throws {TypeError}
 *   If the input is neither a TestConditions instance nor a plain object.
 */
function normaliseTestConditions(tc, dieType) {
  if (tc instanceof TestConditions) return tc;
  if (tc && typeof tc === "object") {
    const { testType, ...conditions } = tc;
    return new TestConditions(testType, conditions, dieType);
  }
  throw new TypeError(
    `Invalid TestConditions: must be a TestConditions instance or a plain object.`
  );
}

module.exports = {
  normaliseTestConditions,
};
