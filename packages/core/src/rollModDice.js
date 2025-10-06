import { rollDice } from "./rollDice.js";
import { DieType, RollType, RollModifier } from "#entities";

/**
 * Rolls multiple modified dice by applying a modifier function or {@link RollModifier}.
 *
 * This function rolls multiple dice using {@link rollDice}, then applies a modifier
 * (either a function `(n) => number` or a {@link RollModifier} instance) to each result.
 * It’s useful for rolling groups of dice with consistent effects — like damage bonuses,
 * penalties, or game mechanics that affect all dice in a pool.
 *
 * @function rollModDice
 * @param {DieType} dieType - The type of die to roll (e.g., `DieType.D6`, `DieType.D20`).
 * @param {Function|RollModifier} modifier - The modifier to apply.
 *   Can be either:
 *   - A function `(n: number) => number`
 *   - A {@link RollModifier} instance
 * @param {Object} [options] - Optional roll configuration.
 * @param {number} [options.count=1] - Number of dice to roll. Default is `1`.
 * @param {RollType|null} [options.rollType=null] - Roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @returns {{ baseArray: number[], modifiedArray: number[] }} - Two parallel arrays:
 *   - `baseArray`: raw dice results before modification.
 *   - `modifiedArray`: results after applying the modifier.
 * @throws {TypeError} If `count` is less than 1.
 * @throws {TypeError} If the modifier is invalid (not a function or RollModifier).
 * @throws {TypeError} If `dieType` or `rollType` are invalid (delegated to {@link rollDice}).
 *
 * @example
 * // Roll 3d6 and apply a +2 bonus to each
 * const results = rollModDice(DieType.D6, (n) => n + 2, { count: 3 });
 * console.log(results);
 * // { baseArray: [3, 5, 1], modifiedArray: [5, 7, 3] }
 *
 * @example
 * // Use a RollModifier instance with advantage
 * const bonus = new RollModifier((n) => Math.min(n + 1, 20));
 * const results = rollModDice(DieType.D20, bonus, { count: 2, rollType: RollType.Advantage });
 *
 * @example
 * // Roll 5d8 with disadvantage and halve each result
 * const results = rollModDice(DieType.D8, (n) => Math.floor(n / 2), { count: 5, rollType: RollType.Disadvantage });
 */
export function rollModDice(
  dieType,
  modifier,
  { count = 1, rollType = null } = {}
) {
  // --- Validation ---
  if (typeof count !== "number" || !Number.isInteger(count) || count < 1) {
    throw new TypeError(`Invalid count: ${count}. Must be a positive integer.`);
  }

  // --- Modifier resolution ---
  const mod =
    modifier instanceof RollModifier ? modifier : new RollModifier(modifier);

  // --- Core logic ---
  const baseArray = rollDice(dieType, { count, rollType });
  const modifiedArray = baseArray.map((base) => mod.apply(base));

  return { baseArray, modifiedArray };
}
