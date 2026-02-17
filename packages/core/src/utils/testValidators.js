const { isValidDieType } = require("../entities/DieType");
const { numSides } = require("./generateResult.js");

/* Typedef ownership:
 * - `PlainObject`, `Conditions`, `ConditionsLike`
 */

/**
 * @typedef {import("../entities/TestType").TestTypeValue} TestTypeValue
 * @typedef {import("../entities/DieType").DieTypeValue} DieTypeValue
 *
 * @typedef {Object} BaseTestCondition
 * @property {DieTypeValue} dieType
 *
 * @typedef {BaseTestCondition & { target: number }} TargetConditions
 * @typedef {BaseTestCondition & { min: number, max: number }} WithinConditions
 * @typedef {BaseTestCondition & { values: number[] }} SpecificListConditions
 * @typedef {BaseTestCondition & { target: number, critical_success?: number, critical_failure?: number }} SkillConditions
 *
 * @typedef {TargetConditions | SkillConditions | WithinConditions | SpecificListConditions} Conditions
 *
 * @typedef {Record<string, any>} PlainObject
 * @typedef {Conditions|PlainObject} ConditionsLike
 */

/**
 * Checks if a number is a valid face value for a die with the given sides.
 */
/**
 * @param {number} n
 * @param {number} sides
 * @returns {boolean}
 */
function isValidFaceValue(n, sides) {
  return Number.isInteger(n) && n >= 1 && n <= sides;
}

/**
 * Checks multiple keys in an object for valid face values.
 */
/**
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
 */
/**
 * @param {SkillConditions|PlainObject} thresholds
 * @returns {boolean}
 */
function isValidThresholdOrder({ target, critical_success, critical_failure }) {
  if (critical_failure != null && critical_failure >= target) return false;
  if (critical_success != null && critical_success < target) return false;
  return true;
}

/**
 * @param {TargetConditions|PlainObject} c
 * @returns {boolean}
 */
function isValidTargetConditions(c) {
  if (!c || !isValidDieType(c.dieType)) return false;
  return isValidFaceValue(c.target, numSides(c.dieType));
}

/**
 * @param {SkillConditions|PlainObject} c
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
 * @param {WithinConditions|PlainObject} c
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
 * @param {SpecificListConditions|PlainObject} c
 * @returns {boolean}
 */
function isValidSpecificListConditions(c) {
  if (!c || !isValidDieType(c.dieType)) return false;
  const sides = numSides(c.dieType);
  if (!Array.isArray(c.values) || c.values.length === 0) return false;
  return c.values.every((v) => isValidFaceValue(v, sides));
}

/**
 * Validates that the given keys on an object are integer values within
 * an explicit inclusive range `[min, max]`.
 *
 * This is useful for modified-range validation where the permissible
 * faces aren't 1..sides but an arbitrary min..max after applying modifiers.
 *
 * @param {PlainObject} obj
 * @param {number} min
 * @param {number} max
 * @param {(string)[]} keys
 * @returns {boolean}
 */
function areValidValuesInRange(obj, min, max, keys) {
  if (!obj) return false;
  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max)
    return false;
  return keys.every((key) => {
    const v = obj[key];
    if (v == null) return true;
    if (Array.isArray(v)) {
      if (v.length === 0) return false;
      return v.every(
        (item) => Number.isInteger(item) && item >= min && item <= max
      );
    }
    return Number.isInteger(v) && v >= min && v <= max;
  });
}

/**
 * Master validation function for all test conditions.
 */
/**
 * @param {Conditions|PlainObject} c
 * @param {TestTypeValue|string} testType
 * @returns {boolean}
 */
function areValidTestConditions(c, testType) {
  switch (testType) {
    case "at_least":
    case "at_most":
    case "exact":
      return isValidTargetConditions(c);
    case "within":
      return isValidWithinConditions(c);
    case "in_list":
      return isValidSpecificListConditions(c);
    case "skill":
      return isValidSkillTestCondition(c);
    default:
      return false;
  }
}

module.exports = {
  isValidFaceValue,
  areValidFaceValues,
  isValidThresholdOrder,
  isValidTargetConditions,
  isValidSkillTestCondition,
  isValidWithinConditions,
  isValidSpecificListConditions,
  areValidTestConditions,
  areValidValuesInRange,
};
