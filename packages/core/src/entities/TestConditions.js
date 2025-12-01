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

const { isValidDieType } = require("./DieType");
const { isValidTestType } = require("./TestType");
const { numSides } = require("../utils");
const validators = require("../utils/testValidators");

/**
 * @typedef {import("./TestType").TestTypeValue} TestTypeValue
 * @typedef {import("./DieType").DieTypeValue} DieTypeValue
 * @typedef {import("../utils/testValidators").Conditions} Conditions
 * @typedef {import("../utils/testValidators").ConditionsLike} ConditionsLike
 */

/**
 * Represents a set of conditions for a dice roll test.
 */
class TestConditions {
  /**
   * @param {TestTypeValue} testType - The test type.
   * @param {Conditions} conditions - The test conditions object.
   * @param {DieTypeValue} dieType - The die type to validate numeric ranges.
   * @throws {TypeError|RangeError} If the test type or conditions are invalid.
   */
  constructor(testType, conditions, dieType) {
    if (!isValidTestType(testType)) {
      throw new TypeError(`Invalid test type: ${testType}`);
    }

    if (!conditions || typeof conditions !== "object") {
      throw new TypeError("conditions must be an object.");
    }

    if (!dieType) {
      throw new TypeError("dieType is required to validate TestConditions.");
    }

    // Validate conditions immediately
    if (!areValidTestConditions({ ...conditions, dieType }, testType)) {
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
    /** @type {Conditions} */
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
      !areValidTestConditions(
        { ...this.conditions, dieType: this.dieType },
        this.testType
      )
    ) {
      throw new TypeError("Invalid test conditions shape.");
    }
  }
}

/**
 * Master validation function for all test conditions.
 *
 * @function areValidTestConditions
 * @param {Conditions} c
 * @param {TestTypeValue} testType
 * @returns {boolean}
 */
function areValidTestConditions(c, testType) {
  // Delegate master validation to utils/testValidators for consistency
  return validators.areValidTestConditions(c, testType);
}

/**
 * Normalises any input into a {@link TestConditions} instance.
 * Supports both pre-existing instances and plain objects.
 * Automatically validates all conditions for the specified die type.
 *
 * @function normaliseTestConditions
 * @param {TestConditions | { testType: TestTypeValue, [key: string]: any }} tc
 *   A {@link TestConditions} instance or plain object with `testType` and other fields.
 * @param {DieTypeValue} dieType
 *   The die type (e.g., `'d6'`, `'d20'`) used for validation.
 * @returns {TestConditions}
 *   A validated {@link TestConditions} instance.
 * @throws {TypeError}
 *   If the input is neither a TestConditions instance nor a plain object.
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
function normaliseTestConditions(tc, dieType) {
  if (tc instanceof TestConditions) return tc;
  if (tc && typeof tc === "object") {
    const { testType, ...rest } = tc;

    // @ts-expect-error: we are asserting that the rest of the object plus dieType
    // will conform to the Conditions union when passed to the constructor
    return new TestConditions(testType, { ...rest }, dieType);
  }
  throw new TypeError(
    `Invalid TestConditions: must be a TestConditions instance or a plain object.`
  );
}

/**
 * @typedef {InstanceType<typeof TestConditions>} TestConditionsInstance
 */

module.exports = {
  TestConditions,
  areValidTestConditions,
  normaliseTestConditions,
};

//
// PRIVATE HELPER FUNCTIONS
//

/**
 * @private
 * @typedef {Object} BaseTestCondition
 * @property {DieTypeValue} dieType
 */

/**
 * @private
 * @typedef {BaseTestCondition & { target: number }} TargetConditions
 * @private
 * @typedef {BaseTestCondition & { min: number, max: number }} WithinConditions
 * @private
 * @typedef {BaseTestCondition & { values: number[] }} SpecificListConditions
 * @private
 * @typedef {BaseTestCondition & { target: number, critical_success?: number, critical_failure?: number }} SkillConditions
 */

/**
 * Checks if a number is a valid face value for a die with the given sides.
 *
 * @private
 * @function isValidFaceValue
 * @param {number} n
 * @param {number} sides
 * @returns {boolean}
 */
function isValidFaceValue(n, sides) {
  return Number.isInteger(n) && n >= 1 && n <= sides;
}

/**
 * Checks multiple keys in an object for valid face values.
 *
 * @private
 * @function areValidFaceValues
 * @template T
 * @param {T} obj
 * @param {number} sides
 * @param {(keyof T)[]} keys
 * @returns {boolean}
 */
function areValidFaceValues(obj, sides, keys) {
  return keys.every((key) => {
    const value = obj[key];
    return (
      value == null || isValidFaceValue(/** @type {number} */ (value), sides)
    );
  });
}

/**
 * Validates the ordering of target and critical thresholds.
 *
 * @private
 * @function isValidThresholdOrder
 * @param {SkillConditions} thresholds
 * @returns {boolean}
 */
function isValidThresholdOrder({ target, critical_success, critical_failure }) {
  if (critical_failure != null && critical_failure >= target) return false;
  if (critical_success != null && critical_success < target) return false;
  return true;
}

/**
 * Validates a target-based condition.
 *
 * @private
 * @function isValidTargetConditions
 * @param {TargetConditions} c
 * @returns {boolean}
 */
function isValidTargetConditions(c) {
  if (!c || !isValidDieType(c.dieType)) return false;
  return isValidFaceValue(c.target, numSides(c.dieType));
}

/**
 * Validates a skill-based test condition.
 *
 * @private
 * @function isValidSkillTestCondition
 * @param {SkillConditions} c
 * @returns {boolean}
 */
function isValidSkillTestCondition(c) {
  if (!c || !isValidDieType(c.dieType)) return false;
  const sides = numSides(c.dieType);

  if (
    !areValidFaceValues(c, sides, [
      "target",
      "critical_success",
      "critical_failure",
    ])
  )
    return false;
  if (!isValidThresholdOrder(c)) return false;

  return true;
}

/**
 * Validates a "within" range condition.
 *
 * @private
 * @function isValidWithinConditions
 * @param {WithinConditions} c
 * @returns {boolean}
 */
function isValidWithinConditions(c) {
  if (!c || !isValidDieType(c.dieType)) return false;
  const sides = numSides(c.dieType);

  if (!areValidFaceValues(c, sides, ["min", "max"])) return false;
  if (c.min > c.max) return false;

  return true;
}

/**
 * Validates a "specific list" condition.
 *
 * @private
 * @function isValidSpecificListConditions
 * @param {SpecificListConditions} c
 * @returns {boolean}
 */
function isValidSpecificListConditions(c) {
  if (!c || !isValidDieType(c.dieType)) return false;
  const sides = numSides(c.dieType);
  if (!Array.isArray(c.values) || c.values.length === 0) return false;
  return c.values.every((v) => isValidFaceValue(v, sides));
}
