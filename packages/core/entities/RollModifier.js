import { isRollModifier } from "#validators";

/**
 * Represents a numeric modifier applied to dice rolls.
 *
 * A RollModifier wraps a pure function `(n: number) => number`
 * that takes a base roll and returns a modified value.
 */
export class RollModifier {
  /**
   * @param {Function} fn - The modifier function `(n: number) => number`.
   */
  constructor(fn) {
    if (!isRollModifier(fn)) {
      throw new TypeError(
        "Invalid roll modifier: must be a function accepting one numeric argument and returning a number."
      );
    }

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
   */
  validate() {
    if (!isRollModifier(this.fn)) {
      throw new TypeError("Invalid roll modifier function shape.");
    }
  }
}
