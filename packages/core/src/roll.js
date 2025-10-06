import { DieType, RollType } from "#entities";
import { generateDieResult } from "#utils";
import { isDieType, isRollType } from "#validators";

/**
 * Rolls a single die of the specified type, optionally applying advantage or disadvantage.
 *
 * @function rollDie
 * @param {DieType} dieType - The type of die to roll (e.g., `DieType.D20`).
 * @param {RollType} [rollType=null] - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @returns {number} The resulting roll value between 1 and the number of sides on the die.
 * @throws {TypeError} If `dieType` is invalid.
 * @throws {TypeError} If `rollType` is provided but invalid.
 *
 * @example
 * // Roll a normal d20
 * const result = rollDie(DieType.D20);
 *
 * @example
 * // Roll a d20 with advantage
 * const result = rollDie(DieType.D20, RollType.Advantage);
 */
export function roll(dieType, rollType = null) {
  // --- Validation ---
  if (!isDieType(dieType)) {
    throw new TypeError(`Invalid die type: ${dieType}`);
  }

  if (rollType !== null && !isRollType(rollType)) {
    throw new TypeError(`Invalid roll type: ${rollType}`);
  }

  // --- Core Logic ---
  const roll1 = generateDieResult(dieType);
  if (rollType === null) return roll1;

  const roll2 = generateDieResult(dieType);
  return rollType === RollType.Advantage
    ? Math.max(roll1, roll2)
    : Math.min(roll1, roll2);
}

/** --- Friendly aliases --- */
export const rollAdv = (dieType) => roll(dieType, RollType.Advantage);
export const rollDis = (dieType) => roll(dieType, RollType.Disadvantage);
export const rollD4 = (rollType = null) => roll(DieType.D4, rollType);
export const rollD6 = (rollType = null) => roll(DieType.D6, rollType);
export const rollD8 = (rollType = null) => roll(DieType.D8, rollType);
export const rollD10 = (rollType = null) => roll(DieType.D10, rollType);
export const rollD12 = (rollType = null) => roll(DieType.D12, rollType);
export const rollD20 = (rollType = null) => roll(DieType.D20, rollType);
