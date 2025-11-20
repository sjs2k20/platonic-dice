import { DieTypeValue } from "../entities";

/**
 * Returns the number of sides for a given die type.
 *
 * @param dieType - The die type (e.g. `"d6"`, `"d20"`).
 * @returns The number of sides.
 * @throws {TypeError} If the die type is invalid.
 *
 * @example
 * numSides("d8"); // 8
 */
export function numSides(dieType: DieTypeValue): number;

/**
 * Generates a single roll result for a given die type.
 *
 * @param dieType - The die type (e.g. `"d6"`, `"d20"`).
 * @returns A random roll result within the valid range (1..sides).
 * @throws {TypeError} If the die type is invalid.
 *
 * @example
 * const result = generateResult("d6"); // → 1..6
 */
export function generateResult(dieType: DieTypeValue): number;
