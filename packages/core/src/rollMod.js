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

const { DieType, RollModifier, normaliseRollModifier } = require("./entities");
const r = require("./roll.js");

/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/RollType").RollTypeValue} RollTypeValue
 * @typedef {import("./entities/RollModifier").RollModifierFunction} RollModifierFunction
 * @typedef {import("./entities/RollModifier").RollModifierInstance} RollModifierInstance
 */

/**
 * Rolls a single modified die by applying a modifier function or RollModifier.
 *
 * This function first rolls a base value using {@link roll}, then applies
 * the provided modifier — either a function `(n) => number` or a
 * {@link RollModifier} instance — to produce the final result.
 *
 * @function rollMod
 * @param {DieTypeValue} dieType - The type of die to roll (e.g., `DieType.D20`).
 * @param {RollModifierFunction|RollModifierInstance} modifier - The modifier to apply.
 *   Can be either:
 *   - A RollModifierFunction `(n: number) => number`
 *   - A {@link RollModifier} instance
 * @param {RollTypeValue | null} [rollType=null] - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
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
function rollMod(dieType, modifier, rollType = null) {
  const mod = normaliseRollModifier(modifier);

  const base = r.roll(dieType, rollType);
  const modified = mod.apply(base);

  return { base, modified };
}

//
// --- Convenience Aliases ---
//

/**
 * @typedef {(rollType?: RollTypeValue | null) => number} DieModifierAlias
 */

/**
 * @description
 * Container for all die-type-specific flat bonus and multiplicative aliases.
 * Generated dynamically from DieType values.
 *
 * @type {Record<string, DieModifierAlias>}
 */
const dieTypeAliases = {};

// --- Flat Bonus Aliases ---
// Flat modifiers from -10 to +10 for each die type
for (const [dieKey, dieValue] of Object.entries(DieType)) {
  for (let i = 1; i <= 10; i++) {
    /** @type {DieModifierAlias} */
    dieTypeAliases[`roll${dieKey}P${i}`] = (rollType = null) =>
      rollMod(dieValue, (n) => n + i, rollType).modified;

    /** @type {DieModifierAlias} */
    dieTypeAliases[`roll${dieKey}M${i}`] = (rollType = null) =>
      rollMod(dieValue, (n) => n - i, rollType).modified;
  }
}

// --- Multiplicative Aliases ---
// Multiplicative modifiers such as ×2, ×10, ×100
const multipliers = [2, 3, 5, 10, 50, 100];
for (const [dieKey, dieValue] of Object.entries(DieType)) {
  for (const m of multipliers) {
    /** @type {DieModifierAlias} */
    dieTypeAliases[`roll${dieKey}T${m}`] = (rollType = null) =>
      rollMod(dieValue, (n) => n * m, rollType).modified;
  }
}

// --- Export all aliases ---
module.exports = {
  rollMod,
  ...dieTypeAliases,
};
