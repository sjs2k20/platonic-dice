import { DieType, RollType } from "#entities";
import { isDieType, isRollType } from "#validators";
import { roll } from "./roll.js";

/**
 * Rolls one or more dice of the specified type, with optional advantage/disadvantage.
 *
 * @param {DieType} dieType - The type of die to roll (e.g., `DieType.D6`, `DieType.D20`).
 * @param {Object} [options] - Optional roll configuration.
 * @param {number} [options.count=1] - Number of dice to roll. Default is 1.
 * @param {RollType} [options.rollType=null] - Roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @returns {number[]} An array of roll results. Always returns an array, even if only one die is rolled.
 * @throws {TypeError} If `dieType` or `rollType` are invalid.
 * @throws {TypeError} If `count` is not a number or less than 1.
 *
 * @example
 * // Roll a single d20
 * const [result] = rollDice(DieType.D20);
 *
 * @example
 * // Roll 3 d6 dice
 * const results = rollDice(DieType.D6, { count: 3 });
 *
 * @example
 * // Roll 2 d20 dice with advantage
 * const results = rollDice(DieType.D20, { count: 2, rollType: RollType.Advantage });
 */
export function rollDice(dieType, { count = 1, rollType = null } = {}) {
  // --- Validation ---
  if (!isDieType(dieType)) {
    throw new TypeError(`Invalid die type: ${dieType}`);
  }

  if (rollType !== null && !isRollType(rollType)) {
    throw new TypeError(`Invalid roll type: ${rollType}`);
  }

  if (typeof count !== "number" || !Number.isInteger(count) || count < 1) {
    throw new TypeError(
      `Invalid count: ${count}. Count must be a positive integer.`
    );
  }

  // --- Core logic ---
  return Array.from({ length: count }, () => roll(dieType, rollType));
}

/** --- Friendly alias generation --- */
const counts = [2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 100];

/**
 * @type {Object<string, (dieType: DieType) => number[]>}
 */
const rollDiceAliases = {};

for (const count of counts) {
  rollDiceAliases[`roll${count}x`] = (dieType) => rollDice(dieType, { count });
  rollDiceAliases[`roll${count}xAdv`] = (dieType) =>
    rollDice(dieType, { count, rollType: RollType.Advantage });
  rollDiceAliases[`roll${count}xDis`] = (dieType) =>
    rollDice(dieType, { count, rollType: RollType.Disadvantage });
}

export const {
  roll2x,
  roll3x,
  roll4x,
  roll5x,
  roll6x,
  roll7x,
  roll8x,
  roll9x,
  roll10x,
  roll25x,
  roll50x,
  roll100x,
  roll2xAdv,
  roll3xAdv,
  roll4xAdv,
  roll5xAdv,
  roll6xAdv,
  roll7xAdv,
  roll8xAdv,
  roll9xAdv,
  roll10xAdv,
  roll25xAdv,
  roll50xAdv,
  roll100xAdv,
  roll2xDis,
  roll3xDis,
  roll4xDis,
  roll5xDis,
  roll6xDis,
  roll7xDis,
  roll8xDis,
  roll9xDis,
  roll10xDis,
  roll25xDis,
  roll50xDis,
  roll100xDis,
} = rollDiceAliases;

// Many rolls with advantage/disadvantage.

/**
 * @type {(dieType: DieType, count: number) => number[]}
 */
export const rollManyAdv = (dieType, count) =>
  rollDice(dieType, { count, rollType: RollType.Advantage });
/**
 * @type {(dieType: DieType, count: number) => number[]}
 */
export const rollManyDis = (dieType, count) =>
  rollDice(dieType, { count, rollType: RollType.Disadvantage });
