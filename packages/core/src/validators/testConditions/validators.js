/**
 * @module @dice/core/src/validators/testConditions
 * @description
 * Validation functions for dice roll test conditions.
 */

const { numSides } = require("../../utils");
const { isDieType } = require("../isDieType.js");
const helpers = require("./helpers.js");

/**
 * Validates a target-based condition.
 * @param {Object} c
 * @returns {boolean}
 */
function isValidTargetCondition(c) {
  if (!c || !isDieType(c.dieType)) return false;
  return helpers.isValidFaceValue(c.target, numSides(c.dieType));
}

/**
 * Validates a skill-based test condition.
 * @param {Object} c
 * @returns {boolean}
 */
function isValidSkillTestCondition(c) {
  if (!c || !isDieType(c.dieType)) return false;
  const sides = numSides(c.dieType);

  if (
    !helpers.areValidFaceValues(c, sides, [
      "target",
      "critical_success",
      "critical_failure",
    ])
  )
    return false;
  if (!helpers.isValidThresholdOrder(c)) return false;

  return true;
}

/**
 * Validates a "within" range condition.
 * @param {Object} c
 * @returns {boolean}
 */
function isValidWithinCondition(c) {
  if (!c || !isDieType(c.dieType)) return false;
  const sides = numSides(c.dieType);

  if (!helpers.areValidFaceValues(c, sides, ["min", "max"])) return false;
  if (c.min > c.max) return false;

  return true;
}

/**
 * Validates a "specific list" condition.
 * @param {Object} c
 * @returns {boolean}
 */
function isValidSpecificListCondition(c) {
  if (!c || !isDieType(c.dieType)) return false;
  const sides = numSides(c.dieType);
  if (!Array.isArray(c.values) || c.values.length === 0) return false;
  return c.values.every((v) => helpers.isValidFaceValue(v, sides));
}

/**
 * Master validation function for all test conditions.
 * @param {Object} c
 * @param {string} testType
 * @returns {boolean}
 */
function isTestCondition(c, testType) {
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

module.exports = {
  isTestCondition,
  isValidTargetCondition,
  isValidSkillTestCondition,
  isValidWithinCondition,
  isValidSpecificListCondition,
};
