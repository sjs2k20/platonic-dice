/**
 * @module @dice/core/src/validators/isRollModifier
 * @description
 * Checks whether a given function is a valid roll modifier.
 */

/**
 * @param {Function | null} m
 * @returns {boolean}
 */
function isRollModifier(m) {
  if (!m || typeof m !== "function") return false;

  /** ---Validate modifier shape --- */
  if (m.length !== 1) return false; // Must declare exactly 1 parameter

  // Quick runtime check: apply to a number and verify return is an integer.
  const testValue = m(1);
  return typeof testValue === "number" && Number.isInteger(testValue);
}

module.exports = {
  isRollModifier,
};
