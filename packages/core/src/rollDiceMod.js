/**
 * @module @platonic-dice/core/src/rollDiceMod
 * @description
 * Rolls multiple dice with optional per-die (`each`) and total (`net`) modifiers.
 * Returns structured results containing both the raw dice and all modified values.
 *
 * @example
 * import { rollDiceMod, RollModifier } from "@platonic-dice/core";
 * import { DieType } from "@platonic-dice/core/src/entities";
 *
 * // Apply a flat +1 to each die, then a +2 net bonus
 * const result = rollDiceMod(DieType.D6, {
 *   each: (n) => n + 1,
 *   net: (sum) => sum + 2
 * }, { count: 3 });
 *
 * console.log(result.base);     // { array: [2, 4, 1], sum: 7 }
 * console.log(result.modified);
 * // {
 * //   each: { array: [3, 5, 2], sum: 10 },
 * //   net: { value: 12 }
 * // }
 *
 * @example
 * // Single RollModifier for net only
 * const bonus = new RollModifier((sum) => sum * 2);
 * const result2 = rollDiceMod(DieType.D6, bonus, { count: 3 });
 */
const { normaliseRollModifier, RollModifier } = require("./entities");
const rd = require("./rollDice.js");

/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/RollModifier").RollModifierFunction} RollModifierFunction
 * @typedef {import("./entities/RollModifier").RollModifierInstance} RollModifierInstance
 * @typedef {import("./entities/RollModifier").DiceModifier} DiceModifier
 * @typedef {import("./entities/RollModifier").RollModifierLike} RollModifierLike
 */

/**
 * Rolls multiple dice with optional per-die (`each`) and net (`net`) modifiers.
 *
 * @function rollDiceMod
 * @param {DieTypeValue} dieType - The die type (e.g., `DieType.D6`).
 * @param {RollModifierLike} [modifier={}] - The modifier(s) to apply.
 * @param {{ count?: number }} [options={}] - Optional roll count (default: 1).
 * @returns {{
 *   base: { array: number[], sum: number },
 *   modified: { each: { array: number[], sum: number }, net: { value: number } }
 * }}
 * @throws {TypeError} If `count` is invalid.
 * @throws {TypeError} If any modifier is invalid.
 */
function rollDiceMod(dieType, modifier = {}, { count = 1 } = {}) {
  // --- Validation ---
  if (typeof count !== "number" || !Number.isInteger(count) || count < 1) {
    throw new TypeError(`Invalid count: ${count}. Must be a positive integer.`);
  }

  // --- Normalise modifier ---
  let eachMod, netMod;

  if (modifier instanceof RollModifier || typeof modifier === "function") {
    // Single modifier → treated as net
    eachMod = normaliseRollModifier(undefined); // identity
    netMod = normaliseRollModifier(modifier);
  } else if (typeof modifier === "object" && modifier !== null) {
    let each, net;
    if (modifier && typeof modifier === "object") {
      each = modifier.each;
      net = modifier.net;
    }
    eachMod = normaliseRollModifier(each);
    netMod = normaliseRollModifier(net);
  } else {
    throw new TypeError(
      `Invalid modifier: ${modifier}. Must be a function, RollModifier, or object.`,
    );
  }

  // --- Roll dice ---
  const base = rd.rollDice(dieType, { count }); // { array, sum }

  // --- Apply 'each' modifier ---
  const eachArray = base.array.map((n) => eachMod.apply(n));
  const eachSum = eachArray.reduce((a, b) => a + b, 0);

  // --- Apply 'net' modifier ---
  const netValue = netMod.apply(eachSum);

  return {
    base,
    modified: {
      each: { array: eachArray, sum: eachSum },
      net: { value: netValue },
    },
  };
}

//
// --- Convenience Aliases ---
//

/**
 * @private
 * Generates a simple accessor alias for `rollDiceMod`.
 * Returns either the `each.array` or the `net.value` depending on `key`.
 * We keep the implementation untyped to avoid complex conditional JSDoc generics
 * which cause TypeScript complaints; callers below provide explicit typings.
 */
/**
 * @param {'eachArray'|'net'} key
 * @returns {(dieType: DieTypeValue, modifier?: RollModifierLike, options?: { count?: number }) => number|number[]}
 */
function alias(key) {
  /**
   * @param {DieTypeValue} dieType
   * @param {RollModifierLike} [modifier]
   * @param {{ count?: number }} [options]
   */
  return (dieType, modifier = {}, options = {}) => {
    const result = rollDiceMod(dieType, modifier, options);
    switch (key) {
      case "eachArray":
        return result.modified.each.array;
      case "net":
        return result.modified.net.value;
      default:
        throw new TypeError(`Unknown alias key: ${key}`);
    }
  };
}

// --- Exports ---

const rollDiceModArr =
  /** @type {(dieType: DieTypeValue, modifier?: RollModifierLike, options?: { count?: number }) => number[]} */ (
    alias("eachArray")
  );

const rollDiceModNet =
  /** @type {(dieType: DieTypeValue, modifier?: RollModifierLike, options?: { count?: number }) => number} */ (
    alias("net")
  );

module.exports = {
  rollDiceMod,
  rollDiceModArr,
  rollDiceModNet,
};
