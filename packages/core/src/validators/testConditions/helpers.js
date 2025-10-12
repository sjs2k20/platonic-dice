/**
 * @private
 * @typedef {Object} Thresholds
 * @property {number} target
 * @property {number} [critical_success]
 * @property {number} [critical_failure]
 */

/**
 * @private
 * Checks if a number is a valid face value for a die with the given sides.
 * @param {number} n
 * @param {number} sides
 * @returns {boolean}
 */
function isValidFaceValue(n, sides) {
  return Number.isInteger(n) && n >= 1 && n <= sides;
}

/**
 * @private
 * Checks multiple keys in an object for valid face values.
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
 * @private
 * Validates the ordering of target and critical thresholds.
 * @param {Thresholds} thresholds
 * @returns {boolean}
 */
function isValidThresholdOrder({ target, critical_success, critical_failure }) {
  if (critical_failure != null && critical_failure >= target) return false;
  if (critical_success != null && critical_success < target) return false;
  return true;
}

module.exports = {
  isValidFaceValue,
  areValidFaceValues,
  isValidThresholdOrder,
};
