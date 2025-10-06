import { numSides } from "#utils";
/**
 * Generates a single roll result for a given die type.
 * @param {DieType} dieType - e.g. "d6", "d20"
 * @returns {number} the result of rolling the die of type `dieType`.
 * @throws {TypeError} If the die type is invalid.
 */
export function generateDieResult(dieType) {
  const sides = numSides(dieType); // validation of dieType happens here
  return Math.floor(Math.random() * sides) + 1;
}
