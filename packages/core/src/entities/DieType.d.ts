/**
 * Enum for die types used in rolling functions.
 *
 * Represents common polyhedral dice (D4–D20) used in tabletop systems.
 *
 * @example
 * import { DieType } from "@platonic-dice/core";
 * const result = roll(DieType.D20);
 */
export enum DieType {
  D4 = "d4",
  D6 = "d6",
  D8 = "d8",
  D10 = "d10",
  D12 = "d12",
  D20 = "d20",
}

/**
 * Checks whether a given value is a valid {@link DieType}.
 *
 * @param dieType - The die type to validate.
 * @returns `true` if valid, otherwise `false`.
 *
 * @example
 * isValidDieType("d6"); // true
 * isValidDieType("d100"); // false
 */
export function isValidDieType(dieType: string | null): boolean;

/** The keys of {@link DieType} (e.g., `"D20"`). */
export type DieTypeKey = keyof typeof DieType;

/** The string values of {@link DieType} (e.g., `"d20"`). */
export type DieTypeValue = (typeof DieType)[DieTypeKey];
