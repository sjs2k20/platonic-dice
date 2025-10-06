import { numSides } from "#utils";
import { isDieType } from "#validators";

/**
 * Checks if a number is an integer between 1 and `sides`.
 */
function isValidFaceValue(n, sides) {
  return Number.isInteger(n) && n >= 1 && n <= sides;
}

/**
 * Checks that numeric properties (if present) are valid face values.
 */
function areValidFaceValues(obj, sides, keys) {
  return keys.every(
    (key) => obj[key] == null || isValidFaceValue(obj[key], sides)
  );
}

/**
 * Checks that thresholds are logically consistent (critical < target <= critical success).
 */
function isValidThresholdOrder({ target, critical_success, critical_failure }) {
  if (critical_failure != null && critical_failure >= target) return false;
  if (critical_success != null && critical_success < target) return false;
  return true;
}

/**
 * Validates a simple target-based test ('at least', 'at most', 'exact').
 */
export function isValidTargetCondition(c) {
  if (!c || !isDieType(c.dieType)) return false;

  const sides = numSides(c.dieType);
  return isValidFaceValue(c.target, sides);
}

/**
 * Validates a skill test (target + optional critical thresholds).
 */
export function isValidSkillTestCondition(c) {
  if (!c || !isDieType(c.dieType)) return false;

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
 * Validates a 'within' test (min <= max).
 */
export function isValidWithinCondition(c) {
  if (!c || !isDieType(c.dieType)) return false;

  const sides = numSides(c.dieType);

  if (!areValidFaceValues(c, sides, ["min", "max"])) return false;
  if (c.min > c.max) return false;

  return true;
}

/**
 * Validates a 'specific list' test (array of valid face values).
 */
export function isValidSpecificListCondition(c) {
  if (!c || !isDieType(c.dieType)) return false;

  const sides = numSides(c.dieType);
  if (!Array.isArray(c.values) || c.values.length === 0) return false;

  return c.values.every((v) => isValidFaceValue(v, sides));
}

/**
 * Validates an 'odd' or 'even' test.
 * Only dieType matters; no numeric target required.
 */
export function isValidOddEvenCondition(c) {
  return c && isDieType(c.dieType) && numSides(c.dieType) >= 1;
}

/**
 * Generic validator entry point for TestConditions.
 * Returns true if the provided condition object is valid for its testType.
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
