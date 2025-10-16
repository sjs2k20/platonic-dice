/**
 * @module @dice/core/src/entities/RollModifier
 * @description
 * Represents a numeric modifier applied to dice rolls.
 *
 * A `RollModifier` wraps a pure function `(n: number) => number`
 * that takes a base roll and returns a modified value.
 *
 * @example
 * const bonus = new RollModifier(n => n + 2);
 * const result = bonus.apply(10); // 12
 */

/**
 * @typedef {(n: number) => number} RollModifierFunction
 * @description
 * A function that takes a single numeric input (the base roll or the total sum)
 * and returns a numeric result. Implementations SHOULD:
 *  - declare exactly one parameter (helps static checks: `fn.length === 1`)
 *  - accept a number and return a number (ideally integer for dice use-cases)
 *
 * Examples:
 * - Per-die modifier: `(n) => n + 1`
 * - Net modifier: `(sum) => Math.floor(sum * 1.5)`
 *
 * Notes:
 * - The runtime `isValidRollModifier` performs a light validation:
 *   checks the function arity and performs a test call `fn(1)` to ensure
 *   a numeric, integer-like result is returned. Keep modifiers pure.
 */

/**
 * @typedef {Object} DiceModifier
 * @property {RollModifierFunction | RollModifier | null | undefined} [each]
 *   Function or {@link RollModifier} applied to each individual die.
 * @property {RollModifierFunction | RollModifier | null | undefined} [net]
 *   Function or {@link RollModifier} applied to the total (sum) of all dice.
 *
 * @description
 * Represents the composite modifier structure used by {@link rollDiceMod}.
 * Each field is optional and defaults to the identity modifier if omitted.
 *
 * @example
 * const modifier = {
 *   each: (n) => n + 1,
 *   net: (sum) => sum + 2,
 * };
 *
 * const mod2 = {
 *   each: new RollModifier((n) => n * 2),
 * };
 */

/**
 * Represents a numeric modifier applied to dice rolls.
 */
class RollModifier {
  /**
   * @param {RollModifierFunction} fn - Modifier function.
   * @throws {TypeError} If the function is not a valid roll modifier.
   */
  constructor(fn) {
    if (!isValidRollModifier(fn)) {
      throw new TypeError(
        "Invalid roll modifier: must be a function accepting one numeric argument and returning a number."
      );
    }

    /** @type {RollModifierFunction} */
    this.fn = fn;
  }

  /**
   * Applies this modifier to a roll result.
   * @param {number} baseValue - The base roll result.
   * @returns {number} - The modified roll result.
   */
  apply(baseValue) {
    return this.fn(baseValue);
  }

  /**
   * Validates that this modifier still conforms to spec.
   * (Useful if modifiers are loaded dynamically or serialized.)
   * @throws {TypeError} If the modifier is invalid.
   */
  validate() {
    if (!isValidRollModifier(this.fn)) {
      throw new TypeError("Invalid roll modifier function shape.");
    }
  }
}

/**
 * Checks whether a given function is a valid roll modifier.
 *
 * @function isValidRollModifier
 * @param {Function | null} m
 * @returns {boolean}
 */
function isValidRollModifier(m) {
  if (!m || typeof m !== "function") return false;

  /** ---Validate modifier shape --- */
  if (m.length !== 1) return false; // Must declare exactly 1 parameter

  // Quick runtime check: apply to a number and verify return is an integer.
  const testValue = m(1);
  return typeof testValue === "number" && Number.isInteger(testValue);
}

/**
 * This function ensures all modifiers conform to the correct structure:
 *  - A {@link RollModifier} instance → returned as-is.
 *  - A function `(n: number) => number` → wrapped in a new {@link RollModifier}.
 *  - `null` or `undefined` → treated as an identity modifier.
 *
 * @function normaliseRollModifier
 * @param {RollModifier | ((n: number) => number) | null | undefined} m
 *   The input modifier to normalise.
 * @returns {RollModifier}
 *   A valid {@link RollModifier} instance.
 * @throws {TypeError}
 *   If the input is invalid (not a RollModifier, function, or null/undefined).
 *
 * @example
 * const rm1 = normaliseRollModifier(); // → identity modifier
 * const rm2 = normaliseRollModifier(x => x + 1); // → RollModifier wrapping function
 * const rm3 = normaliseRollModifier(new RollModifier(x => x * 2)); // → same instance
 */
function normaliseRollModifier(m) {
  if (!m) return new RollModifier((n) => n); // identity modifier
  if (m instanceof RollModifier) return m;
  if (typeof m === "function" && isValidRollModifier(m))
    return new RollModifier(m);
  throw new TypeError("Invalid RollModifier");
}

/**
 * @typedef {InstanceType<typeof RollModifier>} RollModifierInstance
 */

module.exports = {
  RollModifier,
  isValidRollModifier,
  normaliseRollModifier,
};
