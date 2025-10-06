import { roll } from "./roll.js";
import { DieType, RollType, RollModifier } from "#entities";

/**
 * Rolls a single modified die by applying a modifier function or RollModifier.
 *
 * This function first rolls a base value using {@link roll}, then applies
 * the provided modifier (either a function `(n) => number` or a `RollModifier` instance)
 * to transform the result. This is useful for implementing systems like
 * bonuses, penalties, or special dice effects.
 *
 * @function rollMod
 * @param {DieType} dieType - The type of die to roll (e.g., `DieType.D20`).
 * @param {Function|RollModifier} modifier - The modifier to apply.
 *   Can be either:
 *   - A function `(n: number) => number`
 *   - A {@link RollModifier} instance
 * @param {RollType} [rollType=null] - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @returns {{ base: number, modified: number }} - The unmodified roll (`base`) and the modified result (`modified`).
 * @throws {TypeError} If the modifier is invalid (not a function or RollModifier).
 * @throws {TypeError} If the `dieType` or `rollType` are invalid (delegated to {@link roll}).
 *
 * @example
 * // Apply a flat +2 bonus to a d20 roll
 * const result = rollMod(DieType.D20, (n) => n + 2);
 * console.log(result); // { base: 14, modified: 16 }
 *
 * @example
 * // Use a RollModifier instance
 * const bonus = new RollModifier((n) => Math.min(n + 3, 20));
 * const result = rollMod(DieType.D20, bonus);
 *
 * @example
 * // Roll with advantage and apply a halving penalty
 * const result = rollMod(DieType.D10, (n) => Math.floor(n / 2), RollType.Advantage);
 */
export function rollMod(dieType, modifier, rollType = null) {
  const mod =
    modifier instanceof RollModifier ? modifier : new RollModifier(modifier);

  const base = roll(dieType, rollType);
  const modified = mod.apply(base);

  return { base, modified };
}
