/**
 * @module @dice/core/src/utils/generateResult
 * @description
 * Generates a single roll result for a given die type.
 */

const { numSides } = require("./numSides.js");
const { DieType } = require("../entities");

/**
 * @typedef {import("../entities").DieType} DieType
 */

/**
 * Generates a single roll result for a given die type.
 *
 * @function generateResult
 * @param {DieType} dieType - The type of die to roll (e.g., "d6", "d20").
 * @returns {number} The result of rolling the die.
 * @throws {TypeError} If the die type is invalid.
 *
 * @example
 * const result = generateDieResult("d6");
 * console.log(result); // 1..6
 */
function generateResult(dieType) {
  const sides = numSides(dieType); // validation of dieType happens here
  return Math.floor(Math.random() * sides) + 1;
}

module.exports = {
  generateResult,
};
