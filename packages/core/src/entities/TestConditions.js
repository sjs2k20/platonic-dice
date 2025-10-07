/**
 * @module @dice/core/src/entities/TestConditions
 * @description
 * This class validates the test type and associated conditions
 * against the provided {@link DieType} during construction.
 *
 * @example
 * const tc = new TestConditions(TestType.AtLeast, { target: 15 }, DieType.D20);
 * const result = rollTest(DieType.D20, tc);
 */

const { DieType, TestType } = require("../entities");
const { isTestType, isValidTestCondition } = require("../validators");

/**
 * @typedef {import("../entities").DieType} DieType
 * @typedef {import("../entities").TestType} TestType
 * @typedef {import("../entities").TestTypeValue} TestTypeValue
 * @typedef {import("../entities").DieTypeValue} DieTypeValue
 */

/**
 * Represents a set of conditions for a dice roll test.
 */
class TestConditions {
  /**
   * @param {TestTypeValue} testType - The test type.
   * @param {object} conditions - The test conditions object.
   * @param {DieTypeValue} dieType - The die type to validate numeric ranges.
   * @throws {TypeError|RangeError} If the test type or conditions are invalid.
   */
  constructor(testType, conditions, dieType) {
    if (!isTestType(testType)) {
      throw new TypeError(`Invalid test type: ${testType}`);
    }

    if (!conditions || typeof conditions !== "object") {
      throw new TypeError("conditions must be an object.");
    }

    if (!dieType) {
      throw new TypeError("dieType is required to validate TestConditions.");
    }

    // Validate conditions immediately
    if (!isValidTestCondition({ ...conditions, dieType }, testType)) {
      switch (testType) {
        case "at_least":
        case "at_most":
        case "exact":
          throw new RangeError(
            `Invalid ${testType} condition for die type ${dieType}: target must be an integer within valid die faces.`
          );
        case "within":
          throw new RangeError(
            `Invalid 'within' condition for die type ${dieType}: min must be ≤ max and both valid face values.`
          );
        case "in_list":
          throw new RangeError(
            `Invalid 'specificList' condition for die type ${dieType}: values must be a non-empty array of valid face values.`
          );
        case "skill":
          throw new RangeError(
            `Invalid 'skill' condition for die type ${dieType}: target, critical_success, and critical_failure must be valid and logically ordered.`
          );
        default:
          throw new TypeError(`Unknown testType '${testType}'.`);
      }
    }

    /** @type {TestTypeValue} */
    this.testType = testType;
    /** @type {object} */
    this.conditions = conditions;
    /** @type {DieTypeValue} */
    this.dieType = dieType;
  }

  /**
   * Validates that the test conditions still conforms to spec.
   * (Useful if they are loaded dynamically or serialized.)
   * @throws {TypeError} If the test conditions are invalid.
   */
  validate() {
    if (
      !isValidTestCondition(
        { ...this.conditions, ...this.dieType },
        this.testType
      )
    ) {
      throw new TypeError("Invalid test conditions shape.");
    }
  }
}

/**
 * @typedef {InstanceType<typeof TestConditions>} TestConditionsInstance
 */

module.exports = {
  TestConditions,
};
