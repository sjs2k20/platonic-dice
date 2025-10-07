/**
 * @module @dice/core/src/rollDice
 * @description
 * Rolls one or more dice of a given type, returning both the individual rolls
 * and their total sum. Includes convenient aliases for common counts (e.g., `roll3x` for 3 dice).
 *
 * @example
 * import { rollDice, roll3x } from "@dice/core";
 *
 * // Roll a single d20
 * const result = rollDice(DieType.D20);
 * console.log(result.array, result.sum);
 *
 * // Roll 3d6 using an alias
 * const rolls = roll3x(DieType.D6);
 * console.log(rolls); // [2, 5, 4]
 */

const { DieType } = require("./entities");
const { isDieType } = require("./validators");
const { roll } = require("./roll.js");

/**
 * @typedef {import("./entities").DieType} DieType
 */

/**
 * Rolls one or more dice of the specified type.
 *
 * @function rollDice
 * @param {DieType} dieType - The type of die to roll (e.g., `DieType.D6`, `DieType.D20`).
 * @param {Object} [options] - Optional configuration.
 * @param {number} [options.count=1] - Number of dice to roll. Must be a positive integer.
 * @returns {{ array: number[], sum: number }} An object containing:
 *   - `array`: an array of individual die rolls.
 *   - `sum`: the total sum of all rolls.
 * @throws {TypeError} If `dieType` is invalid.
 * @throws {TypeError} If `count` is not a positive integer.
 *
 * @example
 * const result = rollDice(DieType.D6, { count: 5 });
 * console.log(result.sum);   // e.g., 18
 * console.log(result.array); // e.g., [2, 5, 3, 1, 7]
 *
 * @example
 * // Roll a single d20
 * const result = rollDice(DieType.D20);
 *
 * @example
 * // Roll 3d6
 * const result = rollDice(DieType.D6, { count: 3 });
 */
function rollDice(dieType, { count = 1 } = {}) {
  // --- Validation ---
  if (!isDieType(dieType)) {
    throw new TypeError(`Invalid die type: ${dieType}`);
  }

  if (typeof count !== "number" || !Number.isInteger(count) || count < 1) {
    throw new TypeError(
      `Invalid count: ${count}. Count must be a positive integer.`
    );
  }

  // --- Core logic ---
  const array = Array.from({ length: count }, () => roll(dieType));
  const sum = array.reduce((total, n) => total + n, 0);

  return { array, sum };
}

/** --- Friendly alias generation for convenience --- */
const counts = [2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 100];

/**
 * @type {Object<string, (dieType: DieType) => number[]>}
 */
const rollDiceAliases = {};

for (const count of counts) {
  rollDiceAliases[`roll${count}x`] = (dieType) => rollDice(dieType, { count });
}

module.exports = {
  rollDice,
  roll2x,
  roll3x,
  roll4x,
  roll5x,
  roll6x,
  roll7x,
  roll8x,
  roll9x,
  roll10x,
  roll25x,
  roll50x,
  roll100x,
};
