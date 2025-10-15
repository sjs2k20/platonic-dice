/**
 * @module @dice/core/src/utils/numSides
 * @description
 * Returns the number of sides on a die given its {@link DieType}.
 */

const { DieType, isValidDieType } = require("../entities");

/**
 * @typedef {import("../entities/DieType").DieTypeValue} DieTypeValue
 */

/**
 * Returns the number of sides on a die given its type.
 *
 * @function numSides
 * @param {DieTypeValue} dieType - The die type (e.g., "d6", "d20").
 * @returns {number} Number of sides.
 * @throws {TypeError} If the die type is invalid.
 *
 * @example
 * console.log(numSides("d6")); // 6
 */
function numSides(dieType) {
  if (!isValidDieType(dieType)) {
    throw new TypeError(
      `Cannot parse the number of sides: Invalid die type - ${dieType}`
    );
  }
  return parseInt(dieType.slice(1));
}

module.exports = {
  numSides,
};
