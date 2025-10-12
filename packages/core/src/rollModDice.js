/**
 * @module @dice/core/src/rollModDice
 * @description
 * Rolls multiple dice with optional per-die (`each`) and total (`net`) modifiers.
 * Returns structured results containing both the raw dice and all modified values.
 *
 * @example
 * import { rollModDice, RollModifier } from "@dice/core";
 * import { DieType } from "@dice/core/src/entities";
 *
 * // Apply a flat +1 to each die, then a +2 net bonus
 * const result = rollModDice(DieType.D6, {
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
 * const result2 = rollModDice(DieType.D6, bonus, { count: 3 });
 */
const { DieType, normaliseRollModifier, RollModifier } = require("./entities");
const { rollDice } = require("./rollDice.js");

/**
 * @typedef {import("./entities").DieType} DieType
 * @typedef {import("./entities").RollModifier} RollModifier
 */

/**
 * Rolls multiple dice with optional per-die and net modifiers.
 *
 * @function rollModDice
 * @param {DieType} dieType - The type of die to roll (e.g., `DieType.D6`, `DieType.D20`).
 * @param {Function|RollModifier|Object} [modifier={}] - Modifiers to apply:
 *   - A single function or `RollModifier` → treated as a `net` modifier.
 *   - An object `{ each?: Function|RollModifier, net?: Function|RollModifier }`.
 *     Both `each` and `net` are optional (default: identity).
 * @param {Object} [options] - Optional configuration.
 * @param {number} [options.count=1] - Number of dice to roll. Must be a positive integer.
 * @returns {Object} Structured results:
 *   ```
 *   {
 *     base: { array: number[], sum: number },
 *     modified: {
 *       each: { array: number[], sum: number },
 *       net: { value: number }
 *     }
 *   }
 *   ```
 * @throws {TypeError} If `count` is invalid.
 * @throws {TypeError} If any modifier is invalid.
 */
function rollModDice(dieType, modifier = {}, { count = 1 } = {}) {
  // --- Validation ---
  if (typeof count !== "number" || !Number.isInteger(count) || count < 1) {
    throw new TypeError(`Invalid count: ${count}. Must be a positive integer.`);
  }

  // --- Normalise modifier ---
  let eachMod, netMod;

  if (modifier instanceof RollModifier || typeof modifier === "function") {
    // Single modifier → treated as net
    eachMod = normaliseRollModifier(null); // identity
    netMod = normaliseRollModifier(modifier);
  } else if (typeof modifier === "object" && modifier !== null) {
    const { each, net } = modifier;
    eachMod = normaliseRollModifier(each);
    netMod = normaliseRollModifier(net);
  } else {
    throw new TypeError(
      `Invalid modifier: ${modifier}. Must be a function, RollModifier, or object.`
    );
  }

  // --- Roll dice ---
  const base = rollDice(dieType, { count }); // { array, sum }

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
 * Generates a simple accessor alias for `rollModDice`.
 *
 * @param {"eachArray"|"net"} key - Which piece of the result to return
 * @returns {(dieType: DieType, modifier?: RollModifier | Function | { each?: RollModifier | Function, net?: RollModifier | Function }, options?: { count?: number }) => number | number[]}
 */
function alias(key) {
  return (dieType, modifier = {}, options = {}) => {
    const result = rollModDice(dieType, modifier, options);
    switch (key) {
      case "eachArray":
        return result.modified.each.array;
      case "net":
        return result.modified.net.value;
    }
  };
}

// --- Exports ---
const rollModDiceArr = alias("eachArray");
const rollModDiceNet = alias("net");

module.exports = {
  rollModDice,
  rollModDiceArr,
  rollModDiceNet,
};
