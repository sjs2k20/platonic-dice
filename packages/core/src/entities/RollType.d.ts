/**
 * Enum for roll modes (normal, advantage, disadvantage).
 *
 * Used to indicate special roll conditions such as advantage or disadvantage.
 */
export enum RollType {
  Advantage = "advantage",
  Disadvantage = "disadvantage",
}

/**
 * Checks whether a given value is a valid {@link RollType}.
 *
 * @param rollType - The roll type to validate.
 * @returns `true` if valid, otherwise `false`.
 */
export function isValidRollType(rollType?: string): boolean;

/** The keys of {@link RollType} (e.g., `"Advantage"`). */
export type RollTypeKey = keyof typeof RollType;

/** The string values of {@link RollType} (e.g., `"advantage"`). */
export type RollTypeValue = (typeof RollType)[RollTypeKey];
