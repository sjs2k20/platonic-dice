/**
 * @module @dice/core/src/rollMod
 * @description
 * Core logic for rolling a single die and applying a numeric or functional modifier.
 *
 * Provides the foundation for modified rolls — including bonuses, penalties,
 * and scaling effects — as well as convenience aliases like `rollModP5`
 * or `rollModT2` for fast use in common tabletop scenarios.
 *
 * @example
 * import { rollMod, rollModP2, rollModT2 } from "@dice/core";
 *
 * // Roll a D20 with a +2 bonus
 * const result = rollMod(DieType.D20, (n) => n + 2);
 *
 * // Or just the modified value
 * const total = rollModP2(DieType.D20);
 */

import {
  DieType,
  RollType,
  RollModifier,
  normaliseRollModifier,
} from "#entities";
import { roll } from "./roll.js";

/**
 * @typedef {import("#entities").DieType} DieType
 * @typedef {import("#entities").RollType} RollType
 * @typedef {import("#entities").RollModifier} RollModifier
 */

/**
 * Rolls a single modified die by applying a modifier function or RollModifier.
 *
 * This function first rolls a base value using {@link roll}, then applies
 * the provided modifier — either a function `(n) => number` or a
 * {@link RollModifier} instance — to produce the final result.
 *
 * @function rollMod
 * @param {DieType} dieType - The type of die to roll (e.g., `DieType.D20`).
 * @param {Function|RollModifier} modifier - The modifier to apply.
 *   Can be either:
 *   - A function `(n: number) => number`
 *   - A {@link RollModifier} instance
 * @param {RollType | null} [rollType=null] - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @returns {{ base: number, modified: number }} - The unmodified roll (`base`) and the modified result (`modified`).
 * @throws {TypeError} If the modifier is invalid (not a function or RollModifier).
 * @throws {TypeError} If the `dieType` or `rollType` are invalid (delegated to {@link roll}).
 *
 * @example
 * const result = rollMod(DieType.D20, (n) => n + 2);
 * console.log(result); // { base: 14, modified: 16 }
 *
 * @example
 * const bonus = new RollModifier((n) => Math.min(n + 3, 20));
 * const result = rollMod(DieType.D20, bonus);
 *
 * @example
 * const result = rollMod(DieType.D10, (n) => Math.floor(n / 2), RollType.Advantage);
 */
export function rollMod(dieType, modifier, rollType = null) {
  const mod = normaliseRollModifier(modifier);

  const base = roll(dieType, rollType);
  const modified = mod.apply(base);

  return { base, modified };
}

/**
 * @private
 * Wraps a rollMod alias so it returns only the modified result.
 *
 * @param {(dieType: DieType, rollType?: RollType | null) => { base: number, modified: number }} fn
 * @returns {(dieType: DieType, rollType?: RollType | null) => number}
 */
function modifiedOnly(fn) {
  return (dieType, rollType = null) => fn(dieType, rollType).modified;
}

//
// --- Flat Bonus Aliases ---
//

/**
 * Flat modifiers from -10 to +10.
 *
 * @type {Record<string, (dieType: DieType, rollType?: RollType | null) => number>}
 */
const flatBonuses = {};

for (let i = 1; i <= 10; i++) {
  flatBonuses[`rollModP${i}`] = modifiedOnly((dieType, rollType) =>
    rollMod(dieType, (n) => n + i, rollType)
  );
  flatBonuses[`rollModM${i}`] = modifiedOnly((dieType, rollType) =>
    rollMod(dieType, (n) => n - i, rollType)
  );
}

export const {
  rollModP1,
  rollModP2,
  rollModP3,
  rollModP4,
  rollModP5,
  rollModP6,
  rollModP7,
  rollModP8,
  rollModP9,
  rollModP10,
  rollModM1,
  rollModM2,
  rollModM3,
  rollModM4,
  rollModM5,
  rollModM6,
  rollModM7,
  rollModM8,
  rollModM9,
  rollModM10,
} = flatBonuses;

//
// --- Multiplicative Aliases ---
//

/**
 * Multiplicative modifiers such as `×2`, `×10`, `×100`, etc.
 *
 * @type {Record<string, (dieType: DieType, rollType?: RollType | null) => number>}
 */
const timesAliases = {};

const multipliers = [2, 3, 5, 10, 50, 100];
for (const m of multipliers) {
  timesAliases[`rollModT${m}`] = modifiedOnly((dieType, rollType) =>
    rollMod(dieType, (n) => n * m, rollType)
  );
}

export const {
  rollModT2,
  rollModT3,
  rollModT5,
  rollModT10,
  rollModT50,
  rollModT100,
} = timesAliases;
