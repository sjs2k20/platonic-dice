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

const { isRollModifier } = require("../validators");

/**
 * @typedef {(n: number) => number} RollModifierFunction
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
    if (!isRollModifier(fn)) {
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
    if (!isRollModifier(this.fn)) {
      throw new TypeError("Invalid roll modifier function shape.");
    }
  }
}

/**
 * @typedef {InstanceType<typeof RollModifier>} RollModifierInstance
 */

module.exports = {
  RollModifier,
};
