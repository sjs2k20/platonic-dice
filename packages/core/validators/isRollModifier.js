/**
 * @param {Function | null} m - Function to modify the roll of a die.
 * @returns {boolean} - true if the provided 'value' is a valid roll modifier.
 */
export function isRollModifier(m) {
  if (!m || typeof m !== "function") return false;

  /** ---Validate modifier shape --- */
  if (m.length !== 1) return false; // Must declare exactly 1 parameter

  // Quick runtime check: apply to a number and verify return is number
  const testValue = modifier(1);
  return typeof testValue === "number" && !Number.isNaN(testValue);
}
