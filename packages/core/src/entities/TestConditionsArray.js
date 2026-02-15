/**
 * @module @platonic-dice/core/src/entities/TestConditionsArray
 * @description
 * Represents an ordered array of `TestConditions`-like entries which can be
 * evaluated against a set of dice (or modified dice results) to produce an
 * array of outcomes. This is a lightweight building block for multi-dice
 * test types that need to evaluate multiple per-die or per-condition checks.
 */

const { TestConditions, normaliseTestConditions } = require("./TestConditions");

/**
 * @typedef {import("./TestConditions").TestConditionsInstance} TestConditionsInstance
 * @typedef {import("./TestConditions").TestConditionsLike} TestConditionsLike
 */

class TestConditionsArray {
  /**
   * @param {Array<TestConditionsInstance|Object>} arr - Array of TestConditions instances or plain objects
   * @param {string|undefined} [defaultDieType] - Optional default die type used to normalise plain objects
  /**
   * @param {Array<TestConditionsInstance|TestConditionsLike>} arr - Array of TestConditions instances or plain objects
   * @param {string|undefined} [defaultDieType] - Optional default die type used to normalise plain objects
   */
  constructor(arr = [], defaultDieType = undefined) {
    this.defaultDieType = defaultDieType;
    /** @type {TestConditionsInstance[]} */
    this.conditions = arr.map((c, idx) => {
      // If already a TestConditions instance, accept as-is
      if (c instanceof TestConditions) return c;

      // Plain object: try to determine dieType per-entry
      if (c && typeof c === "object") {
        // c is a TestConditionsLike here; prefer per-entry dieType then default
        const entryDie =
          /** @type {TestConditionsLike} */ (c).dieType || defaultDieType;
        if (!entryDie)
          throw new TypeError(
            `TestConditionsArray: element at index ${idx} requires a dieType (either on the element or a default passed to the constructor)`,
          );
        return normaliseTestConditions(
          /** @type {TestConditionsLike} */ (c),
          entryDie,
        );
      }

      throw new TypeError(
        `TestConditionsArray: element at index ${idx} must be a TestConditions instance or a plain object`,
      );
    });
  }

  /**
   * Evaluate each contained condition against a provided numeric value.
   * Returns an array of outcome values (strings) for each condition in order.
   *
   * @param {number} value - The numeric value to evaluate (e.g., a die face or modified value)
   * @param {Function} evaluator - A function `(value, testConditionsInstance) => outcome`.
   *        If omitted, each TestConditions instance is expected to be consumable by
   *        existing utilities that accept a TestConditions instance.
   * @returns {Array<string>} outcomes
   */
  evaluateEach(value, evaluator) {
    if (typeof value !== "number")
      throw new TypeError("value must be a number");
    const evalFn = evaluator;
    return this.conditions.map((tc) => {
      if (typeof evalFn === "function") return evalFn(value, tc);
      // Default: delegate to a helper that callers should provide; throw otherwise
      throw new TypeError(
        "No evaluator provided for TestConditionsArray.evaluateEach",
      );
    });
  }

  /**
   * Convenience to return the raw TestConditions instances array.
   * @returns {TestConditionsInstance[]}
   */
  toArray() {
    return this.conditions.slice();
  }
}

module.exports = {
  TestConditionsArray,
};
