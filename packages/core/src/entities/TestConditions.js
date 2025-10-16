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

/**
 * @typedef {import("./TestType").TestTypeValue} TestTypeValue
 * @typedef {import("./DieType").DieTypeValue} DieTypeValue
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
 * @param {Object} c
 * @param {TestTypeValue} testType
 * @returns {boolean}
 */
function areValidTestConditions(c, testType) {
  switch (testType) {
    case "at_least":
    case "at_most":
    case "exact":
      return isValidTargetCondition(c);
    case "within":
      return isValidWithinCondition(c);
    case "in_list":
      return isValidSpecificListCondition(c);
    // case "odd":
    // case "even":
    //   return isValidOddEvenCondition(c);
    case "skill":
      return isValidSkillTestCondition(c);
    default:
      return false;
  }
}

/**
 * Normalises any input into a {@link TestConditions} instance.
 * Supports both pre-existing instances and plain objects.
 * Automatically validates all conditions for the specified die type.
 *
 * @function normaliseTestConditions
 * @param {TestConditions | { testType: string, [key: string]: any }} tc
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
    const { testType, ...conditions } = tc;
    return new TestConditions(testType, conditions, dieType);
  }
  throw new TypeError(
    `Invalid TestConditions: must be a TestConditions instance or a plain object.`
  );
}

/**
 * @typedef {InstanceType<typeof TestConditions>} TestConditionsInstance
 */

/**
 * @private
 * @typedef {Object} Thresholds
 * @property {number} target
 * @property {number} [critical_success]
 * @property {number} [critical_failure]
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
 * @param {Object} obj
 * @param {number} sides
 * @param {string[]} keys
 * @returns {boolean}
 */
function areValidFaceValues(obj, sides, keys) {
  return keys.every(
    (key) => obj[key] == null || isValidFaceValue(obj[key], sides)
  );
}

/**
 * Validates the ordering of target and critical thresholds.
 *
 * @private
 * @function isValidThresholdOrder
 * @param {Thresholds} thresholds
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
 * @function isValidTargetCondition
 * @param {Object} c
 * @returns {boolean}
 */
function isValidTargetCondition(c) {
  if (!c || !isValidDieType(c.dieType)) return false;
  return isValidFaceValue(c.target, numSides(c.dieType));
}

/**
 * Validates a skill-based test condition.
 *
 * @private
 * @function isValidSkillTestCondition
 * @param {Object} c
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
 * @function isValidWithinCondition
 * @param {Object} c
 * @returns {boolean}
 */
function isValidWithinCondition(c) {
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
 * @function isValidSpecificListCondition
 * @param {Object} c
 * @returns {boolean}
 */
function isValidSpecificListCondition(c) {
  if (!c || !isValidDieType(c.dieType)) return false;
  const sides = numSides(c.dieType);
  if (!Array.isArray(c.values) || c.values.length === 0) return false;
  return c.values.every((v) => isValidFaceValue(v, sides));
}
