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

const {
  DieType,
  RollType,
  RollModifier,
  normaliseRollModifier,
} = require("./entities");
const { roll } = require("./roll.js");

/**
 * @typedef {import("./entities").DieType} DieType
 * @typedef {import("./entities").RollType} RollType
 * @typedef {import("./entities").RollModifier} RollModifier
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
function rollMod(dieType, modifier, rollType = null) {
  const mod = normaliseRollModifier(modifier);

  const base = roll(dieType, rollType);
  const modified = mod.apply(base);

  return { base, modified };
}

//
// --- Convenience Aliases ---
//

/**
 * @typedef {(rollType?: RollType | null) => number} DieModifierAlias
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
for (const die of Object.values(DieType)) {
  for (let i = 1; i <= 10; i++) {
    /** @type {DieModifierAlias} */
    dieTypeAliases[`roll${die}P${i}`] = (rollType = null) =>
      rollMod(die, (n) => n + i, rollType).modified;

    /** @type {DieModifierAlias} */
    dieTypeAliases[`roll${die}M${i}`] = (rollType = null) =>
      rollMod(die, (n) => n - i, rollType).modified;
  }
}

// --- Multiplicative Aliases ---
// Multiplicative modifiers such as ×2, ×10, ×100
const multipliers = [2, 3, 5, 10, 50, 100];
for (const die of Object.values(DieType)) {
  for (const m of multipliers) {
    /** @type {DieModifierAlias} */
    dieTypeAliases[`roll${die}T${m}`] = (rollType = null) =>
      rollMod(die, (n) => n * m, rollType).modified;
  }
}

// --- Export all aliases ---
module.exports = {
  rollMod,
  // Flat bonuses +1..+10
  rollD4P1,
  rollD4P2,
  rollD4P3,
  rollD4P4,
  rollD4P5,
  rollD4P6,
  rollD4P7,
  rollD4P8,
  rollD4P9,
  rollD4P10,
  rollD6P1,
  rollD6P2,
  rollD6P3,
  rollD6P4,
  rollD6P5,
  rollD6P6,
  rollD6P7,
  rollD6P8,
  rollD6P9,
  rollD6P10,
  rollD8P1,
  rollD8P2,
  rollD8P3,
  rollD8P4,
  rollD8P5,
  rollD8P6,
  rollD8P7,
  rollD8P8,
  rollD8P9,
  rollD8P10,
  rollD10P1,
  rollD10P2,
  rollD10P3,
  rollD10P4,
  rollD10P5,
  rollD10P6,
  rollD10P7,
  rollD10P8,
  rollD10P9,
  rollD10P10,
  rollD12P1,
  rollD12P2,
  rollD12P3,
  rollD12P4,
  rollD12P5,
  rollD12P6,
  rollD12P7,
  rollD12P8,
  rollD12P9,
  rollD12P10,
  rollD20P1,
  rollD20P2,
  rollD20P3,
  rollD20P4,
  rollD20P5,
  rollD20P6,
  rollD20P7,
  rollD20P8,
  rollD20P9,
  rollD20P10,

  // Flat bonuses -1..-10
  rollD4M1,
  rollD4M2,
  rollD4M3,
  rollD4M4,
  rollD4M5,
  rollD4M6,
  rollD4M7,
  rollD4M8,
  rollD4M9,
  rollD4M10,
  rollD6M1,
  rollD6M2,
  rollD6M3,
  rollD6M4,
  rollD6M5,
  rollD6M6,
  rollD6M7,
  rollD6M8,
  rollD6M9,
  rollD6M10,
  rollD8M1,
  rollD8M2,
  rollD8M3,
  rollD8M4,
  rollD8M5,
  rollD8M6,
  rollD8M7,
  rollD8M8,
  rollD8M9,
  rollD8M10,
  rollD10M1,
  rollD10M2,
  rollD10M3,
  rollD10M4,
  rollD10M5,
  rollD10M6,
  rollD10M7,
  rollD10M8,
  rollD10M9,
  rollD10M10,
  rollD12M1,
  rollD12M2,
  rollD12M3,
  rollD12M4,
  rollD12M5,
  rollD12M6,
  rollD12M7,
  rollD12M8,
  rollD12M9,
  rollD12M10,
  rollD20M1,
  rollD20M2,
  rollD20M3,
  rollD20M4,
  rollD20M5,
  rollD20M6,
  rollD20M7,
  rollD20M8,
  rollD20M9,
  rollD20M10,

  // Multiplicative
  rollD4T2,
  rollD4T3,
  rollD4T5,
  rollD4T10,
  rollD4T50,
  rollD4T100,
  rollD6T2,
  rollD6T3,
  rollD6T5,
  rollD6T10,
  rollD6T50,
  rollD6T100,
  rollD8T2,
  rollD8T3,
  rollD8T5,
  rollD8T10,
  rollD8T50,
  rollD8T100,
  rollD10T2,
  rollD10T3,
  rollD10T5,
  rollD10T10,
  rollD10T50,
  rollD10T100,
  rollD12T2,
  rollD12T3,
  rollD12T5,
  rollD12T10,
  rollD12T50,
  rollD12T100,
  rollD20T2,
  rollD20T3,
  rollD20T5,
  rollD20T10,
  rollD20T50,
  rollD20T100,
};
