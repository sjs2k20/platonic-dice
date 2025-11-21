/**
 * @module @platonic-dice/core/src/utils/determineOutcome
 * @description
 * Determines the outcome of a roll based on provided test conditions.
 */

function getEntities() {
  return require("../entities");
}

/**
 * @typedef {import("../entities/Outcome").OutcomeValue} OutcomeValue
 * @typedef {import("../entities/TestConditions").TestConditionsInstance} TestConditionsInstance
 * @typedef {import("../entities/TestConditions").Conditions} Conditions
 * @typedef {import("../entities/TestType").TestTypeValue} TestTypeValue
 * @typedef {import("../entities/DieType").DieTypeValue} DieTypeValue
 */

/**
 * @private
 * @typedef {{ testType: TestTypeValue, dieType: DieTypeValue } & Conditions} TestConditionsLike
 */

/**
 * Determines the outcome of a roll based on provided {@link TestConditions}.
 * Returns standard {@link Outcome} values including success, failure, and criticals.
 *
 * @function determineOutcome
 * @param {number} value - The rolled (possibly modified) result.
 * @param {TestConditionsInstance|TestConditionsLike} testConditions - The conditions defining success/failure thresholds.
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
  const { Outcome, TestType, TestConditions } = getEntities();
  const {
    ModifiedTestConditions,
  } = require("../entities/ModifiedTestConditions");

  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new TypeError("value must be a valid number.");
  }

  // Handle ModifiedTestConditions instances - no need to re-validate
  if (testConditions instanceof ModifiedTestConditions) {
    /** @type {TestConditionsInstance} */
    // @ts-ignore - ModifiedTestConditions has compatible structure for outcome evaluation
    const { testType, conditions } = testConditions;
    // Use the switch statement below to determine outcome
    return evaluateOutcome(value, testType, conditions, Outcome, TestType);
  }

  // Normalise plain object input into a TestConditions instance
  if (!(testConditions instanceof TestConditions)) {
    const { testType, dieType, ...rest } = /** @type {TestConditionsLike} */ (
      testConditions
    );

    // Inject dieType into the conditions object to satisfy TestConditions
    const fullConditions = { ...rest, dieType };

    testConditions = new TestConditions(testType, fullConditions, dieType);
  }

  /** @type {TestConditionsInstance} */
  const { testType, conditions } = testConditions;

  return evaluateOutcome(value, testType, conditions, Outcome, TestType);
}

/**
 * Core evaluation logic extracted for reuse.
 * @private
 * @param {number} value
 * @param {TestTypeValue} testType
 * @param {Conditions | any} conditions
 * @param {any} Outcome
 * @param {any} TestType
 * @returns {OutcomeValue}
 */
function evaluateOutcome(value, testType, conditions, Outcome, TestType) {
  switch (testType) {
    case TestType.AtLeast:
    case TestType.AtMost:
    case TestType.Exact: {
      const { target } = /** @type {{ target: number }} */ (conditions);
      if (testType === TestType.AtLeast)
        return value >= target ? Outcome.Success : Outcome.Failure;
      if (testType === TestType.AtMost)
        return value <= target ? Outcome.Success : Outcome.Failure;
      return value === target ? Outcome.Success : Outcome.Failure;
    }

    case TestType.Within: {
      const { min, max } = /** @type {{ min: number, max: number }} */ (
        conditions
      );
      return value >= min && value <= max ? Outcome.Success : Outcome.Failure;
    }

    case TestType.InList: {
      const { values } = /** @type {{ values: number[] }} */ (conditions);
      return Array.isArray(values) && values.includes(value)
        ? Outcome.Success
        : Outcome.Failure;
    }

    case TestType.Skill: {
      const { target, critical_success, critical_failure } =
        /** @type {{ target: number, critical_success?: number, critical_failure?: number }} */ (
          conditions
        );

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
