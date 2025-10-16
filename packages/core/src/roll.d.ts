import { DieTypeValue, RollTypeValue } from "./entities";

/**
 * Rolls a single die of the specified type, optionally with advantage or disadvantage.
 *
 * @param dieType - The type of die to roll (e.g., `DieType.D20`).
 * @param rollType - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @returns The rolled value (an integer between 1 and the die's maximum face).
 * @throws {TypeError} If the provided `dieType` or `rollType` is invalid.
 *
 * @example
 * ```ts
 * import { roll, DieType, RollType } from "@dice/core";
 *
 * const normal = roll(DieType.D20);
 * const adv = roll(DieType.D20, RollType.Advantage);
 * const dis = roll(DieType.D20, RollType.Disadvantage);
 * ```
 */
export function roll(
  dieType: DieTypeValue,
  rollType?: RollTypeValue | null
): number;

/**
 * Rolls a die with advantage.
 *
 * @param dieType - The die type (e.g., `DieType.D10`).
 * @returns The higher of two rolled values.
 *
 * @example
 * ```ts
 * const high = rollAdv(DieType.D10);
 * ```
 */
export function rollAdv(dieType: DieTypeValue): number;

/**
 * Rolls a die with disadvantage.
 *
 * @param dieType - The die type (e.g., `DieType.D10`).
 * @returns The lower of two rolled values.
 *
 * @example
 * ```ts
 * const low = rollDis(DieType.D10);
 * ```
 */
export function rollDis(dieType: DieTypeValue): number;

/**
 * Rolls a D4 die.
 * @param rollType - Optional roll mode (`advantage` or `disadvantage`).
 */
export function rollD4(rollType?: RollTypeValue | null): number;

/**
 * Rolls a D6 die.
 * @param rollType - Optional roll mode (`advantage` or `disadvantage`).
 */
export function rollD6(rollType?: RollTypeValue | null): number;

/**
 * Rolls a D8 die.
 * @param rollType - Optional roll mode (`advantage` or `disadvantage`).
 */
export function rollD8(rollType?: RollTypeValue | null): number;

/**
 * Rolls a D10 die.
 * @param rollType - Optional roll mode (`advantage` or `disadvantage`).
 */
export function rollD10(rollType?: RollTypeValue | null): number;

/**
 * Rolls a D12 die.
 * @param rollType - Optional roll mode (`advantage` or `disadvantage`).
 */
export function rollD12(rollType?: RollTypeValue | null): number;

/**
 * Rolls a D20 die.
 * @param rollType - Optional roll mode (`advantage` or `disadvantage`).
 */
export function rollD20(rollType?: RollTypeValue | null): number;
