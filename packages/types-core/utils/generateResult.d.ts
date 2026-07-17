export type DieTypeValue = import("../entities/DieType").DieTypeValue;
/**
 * Generates a single roll result for a given die type.
 *
 * @function generateResult
 * @param {DieTypeValue} dieType - The type of die to roll (e.g., "d6", "d20").
 * @returns {number} The result of rolling the die.
 * @throws {TypeError} If the die type is invalid.
 *
 * @example
 * const result = generateResult("d6");
 * console.log(result); // 1..6
 */
export function generateResult(dieType: DieTypeValue): number;
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
export function numSides(dieType: DieTypeValue): number;
