/**
 * @module @dice/core/validators/testConditions
 * @description
 * Validation functions for dice roll test conditions.
 */

import { numSides } from "#utils";
import { isDieType } from "#validators";
import * as helpers from "./helpers.js";

/**
 * Validates a target-based condition.
 * @param {Object} c
 * @returns {boolean}
 */
export function isValidTargetCondition(c) {
  if (!c || !isDieType(c.dieType)) return false;
  return helpers.isValidFaceValue(c.target, numSides(c.dieType));
}

/**
 * Validates a skill-based test condition.
 * @param {Object} c
 * @returns {boolean}
 */
export function isValidSkillTestCondition(c) {
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
export function isValidWithinCondition(c) {
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
export function isValidSpecificListCondition(c) {
  if (!c || !isDieType(c.dieType)) return false;
  const sides = numSides(c.dieType);
  if (!Array.isArray(c.values) || c.values.length === 0) return false;
  return c.values.every((v) => helpers.isValidFaceValue(v, sides));
}

/**
 * Validates an "odd" or "even" condition.
 * @param {Object} c
 * @returns {boolean}
 */
export function isValidOddEvenCondition(c) {
  return c && isDieType(c.dieType) && numSides(c.dieType) >= 1;
}

/**
 * Master validation function for all test conditions.
 * @param {Object} c
 * @param {string} testType
 * @returns {boolean}
 */
export function isValidTestCondition(c, testType) {
  switch (testType) {
    case "atLeast":
    case "atMost":
    case "exact":
      return isValidTargetCondition(c);
    case "within":
      return isValidWithinCondition(c);
    case "specificList":
      return isValidSpecificListCondition(c);
    case "odd":
    case "even":
      return isValidOddEvenCondition(c);
    case "skill":
      return isValidSkillTestCondition(c);
    default:
      return false;
  }
}
