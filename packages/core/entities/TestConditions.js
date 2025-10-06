import { isValidTestCondition } from "#validators/test_conditions/index.js";

/**
 * Represents a set of conditions for a dice roll test.
 */
export class TestConditions {
  /**
   * @param {string} testType - The type of test ('atLeast', 'atMost', 'exact', 'within', 'specificList', 'odd', 'even', 'skill').
   * @param {object} conditions - The test conditions object (target, min/max, values, critical thresholds, etc.).
   */
  constructor(testType, conditions) {
    if (typeof testType !== "string") {
      throw new TypeError("testType must be a string.");
    }

    if (!conditions || typeof conditions !== "object") {
      throw new TypeError("conditions must be an object.");
    }

    this.testType = testType;
    this.conditions = conditions;
  }

  /**
   * Validates this TestConditions instance against a given die type.
   * Throws if invalid.
   * @param {string} dieType - The die type to validate against (e.g., 'd6', 'd20').
   * @throws {TypeError|RangeError} If the conditions are invalid.
   */
  validate(dieType) {
    if (!isValidTestCondition({ ...this.conditions, dieType }, this.testType)) {
      // Compose meaningful error messages based on testType
      switch (this.testType) {
        case "atLeast":
        case "atMost":
        case "exact":
          throw new RangeError(
            `Invalid ${this.testType} condition for die type ${dieType}: target must be an integer within valid die faces.`
          );
        case "within":
          throw new RangeError(
            `Invalid 'within' condition for die type ${dieType}: min must be ≤ max and both valid face values.`
          );
        case "specificList":
          throw new RangeError(
            `Invalid 'specificList' condition for die type ${dieType}: values must be a non-empty array of valid face values.`
          );
        case "odd":
        case "even":
          throw new RangeError(
            `Invalid '${this.testType}' condition for die type ${dieType}.`
          );
        case "skill":
          throw new RangeError(
            `Invalid 'skill' condition for die type ${dieType}: target, critical_success, and critical_failure must be valid and logically ordered.`
          );
        default:
          throw new TypeError(`Unknown testType '${this.testType}'.`);
      }
    }
  }

  /**
   * Returns a plain object suitable for passing to a rollTest method.
   * Includes only the relevant condition fields.
   * @returns {object}
   */
  toObject() {
    // Return a shallow copy to avoid mutation
    return { ...this.conditions };
  }
}
