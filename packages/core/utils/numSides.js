/**
 * @module @dice/core/utils/numSides
 * @description
 * Returns the number of sides on a die given its {@link DieType}.
 */

import { DieType } from "#entities";
import { isDieType } from "#validators";

/**
 * @typedef {import("#entities").DieType} DieType
 */

/**
 * Returns the number of sides on a die given its type.
 *
 * @function numSides
 * @param {DieType} dieType - The die type (e.g., "d6", "d20").
 * @returns {number} Number of sides.
 * @throws {TypeError} If the die type is invalid.
 *
 * @example
 * console.log(numSides("d6")); // 6
 */
export function numSides(dieType) {
  if (!isDieType(dieType)) {
    throw new TypeError(
      `Cannot parse the number of sides: Invalid die type - ${dieType}`
    );
  }
  return parseInt(dieType.slice(1));
}
