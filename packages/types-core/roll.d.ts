export type DieTypeValue = import("./entities/DieType").DieTypeValue;
export type RollTypeValue = import("./entities/RollType").RollTypeValue;
/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/RollType").RollTypeValue} RollTypeValue
 */
/**
 * Rolls a single die of the specified type, optionally applying advantage or disadvantage.
 *
 * @function roll
 * @param {DieTypeValue} dieType - The type of die to roll (e.g., `DieType.D20`).
 * @param {RollTypeValue | undefined} [rollType=undefined] - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @returns {number} The rolled value (integer between 1 and the die's maximum face).
 * @throws {TypeError} If `dieType` or `rollType` are invalid.
 *
 * @example
 * const result = roll(DieType.D20, RollType.Advantage);
 */
export function roll(dieType: DieTypeValue, rollType?: RollTypeValue | undefined): number;
/**
 * Rolls a die with advantage.
 * @type {(dieType: DieTypeValue) => number}
 *
 * @example
 * const result = rollAdv(DieType.D10);
 */
export const rollAdv: (dieType: DieTypeValue) => number;
/**
 * Rolls a die with disadvantage.
 * @type {(dieType: DieTypeValue) => number}
 *
 * @example
 * const result = rollDis(DieType.D10);
 */
export const rollDis: (dieType: DieTypeValue) => number;
/**
 * Rolls a D4 die.
 * @type {(rollType?: RollTypeValue | undefined) => number}
 */
export const rollD4: (rollType?: RollTypeValue | undefined) => number;
/**
 * Rolls a D6 die.
 * @type {(rollType?: RollTypeValue | undefined) => number}
 */
export const rollD6: (rollType?: RollTypeValue | undefined) => number;
/**
 * Rolls a D8 die.
 * @type {(rollType?: RollTypeValue | undefined) => number}
 */
export const rollD8: (rollType?: RollTypeValue | undefined) => number;
/**
 * Rolls a D10 die.
 * @type {(rollType?: RollTypeValue | undefined) => number}
 */
export const rollD10: (rollType?: RollTypeValue | undefined) => number;
/**
 * Rolls a D12 die.
 * @type {(rollType?: RollTypeValue | undefined) => number}
 */
export const rollD12: (rollType?: RollTypeValue | undefined) => number;
/**
 * Rolls a D20 die.
 * @type {(rollType?: RollTypeValue | undefined) => number}
 */
export const rollD20: (rollType?: RollTypeValue | undefined) => number;
