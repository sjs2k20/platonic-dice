/**
 * @module @dice/core/utils/generateDieResult
 * @description
 * Generates a single roll result for a given die type.
 */

import { numSides } from "./numSides.js";
import { DieType } from "#entities";

/**
 * @typedef {import("#entities").DieType} DieType
 */

/**
 * Generates a single roll result for a given die type.
 *
 * @function generateDieResult
 * @param {DieType} dieType - The type of die to roll (e.g., "d6", "d20").
 * @returns {number} The result of rolling the die.
 * @throws {TypeError} If the die type is invalid.
 *
 * @example
 * const result = generateDieResult("d6");
 * console.log(result); // 1..6
 */
export function generateDieResult(dieType) {
  const sides = numSides(dieType); // validation of dieType happens here
  return Math.floor(Math.random() * sides) + 1;
}
