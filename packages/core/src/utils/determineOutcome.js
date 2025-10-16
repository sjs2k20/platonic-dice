/**
 * @module @dice/core/src/utils/determineOutcome
 * @description
 * Determines the outcome of a roll based on provided test conditions.
 */

const { Outcome, TestType, TestConditions } = require("../entities");

/**
 * @typedef {import("../entities/Outcome").OutcomeValue} OutcomeValue
 * @typedef {import("../entities/TestConditions").TestConditionsInstance} TestConditionsInstance
 */

/**
 * Determines the outcome of a roll based on provided {@link TestConditions}.
 * Returns standard {@link Outcome} values including success, failure, and criticals.
 *
 * @function determineOutcome
 * @param {number} value - The rolled (possibly modified) result.
 * @param {TestConditionsInstance|Object} testConditions - The conditions defining success/failure thresholds.
 * @returns {OutcomeValue} The resulting outcome.
 * @throws {TypeError} If the provided conditions or test type are invalid.
 *
 * @example
 * const test = new TestConditions(TestType.AtLeast, { target: 12 });
 * const outcome = determineOutcome(14, test);
 * console.log(outcome); // "success"
 *
 * @example
 * const skill = new TestConditions(TestType.Skill, {
 *   target: 10,
 *   critical_success: 20,
 *   critical_failure: 1
 * });
 * console.log(determineOutcome(1, skill)); // "critical_failure"
 */
function determineOutcome(value, testConditions) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError("value must be a valid number.");
  }

  // Normalise plain object input into a TestConditions instance
  if (!(testConditions instanceof TestConditions)) {
    const { testType, dieType, ...conditions } = testConditions;
    testConditions = new TestConditions(testType, conditions, dieType);
  }

  const { testType, conditions } = testConditions;

  switch (testType) {
    case TestType.AtLeast:
      return value >= conditions.target ? Outcome.Success : Outcome.Failure;

    case TestType.AtMost:
      return value <= conditions.target ? Outcome.Success : Outcome.Failure;

    case TestType.Exact:
      return value === conditions.target ? Outcome.Success : Outcome.Failure;

    case TestType.Within:
      return value >= conditions.min && value <= conditions.max
        ? Outcome.Success
        : Outcome.Failure;

    case TestType.InList:
      return Array.isArray(conditions.values) &&
        conditions.values.includes(value)
        ? Outcome.Success
        : Outcome.Failure;

    case TestType.Skill: {
      const { target, critical_success, critical_failure } = conditions;

      if (critical_failure != null && value <= critical_failure)
        return Outcome.CriticalFailure;

      if (critical_success != null && value >= critical_success)
        return Outcome.CriticalSuccess;

      return value >= target ? Outcome.Success : Outcome.Failure;
    }

    default:
      throw new TypeError(`Unknown or unsupported testType '${testType}'.`);
  }
}

module.exports = {
  determineOutcome,
};
