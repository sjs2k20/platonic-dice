import { DieType } from "#root";
import { isDieType } from "#validators";

/**
 * Gets the number of sides on a die given its type.
 * @param {DieType} dieType - e.g. "d6", "d20"
 * @returns {number}
 * @throws {TypeError} If the die type is invalid.
 */
export function numSides(dieType) {
  if (!isDieType(dieType)) {
    throw new TypeError(
      `Cannot parse the number of sides: Invalid die type - ${dieType}`
    );
  }
  return parseInt(dieType.slice(1));
}
