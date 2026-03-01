export type RollTypeKey = keyof typeof RollType;
export type RollTypeValue = (typeof RollType)[keyof typeof RollType];
export type RollType = string;
/**
 * @module @platonic-dice/core/src/entities/RollType
 * @description
 * Enum for roll modes (normal, advantage, disadvantage).
 *
 * @readonly
 * @enum {string}
 */
export const RollType: Readonly<{
    Advantage: "advantage";
    Disadvantage: "disadvantage";
}>;
/**
 * Checks whether a given value is a valid `RollType`.
 *
 * @function isValidRollType
 * @param {RollTypeValue | null | undefined} rollType
 * @returns {boolean}
 */
export function isValidRollType(rollType: RollTypeValue | null | undefined): boolean;
