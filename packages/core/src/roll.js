/**
 * @module @dice/core/src/roll
 * @description
 * Core logic for rolling a single die, with support for advantage/disadvantage
 * and convenience aliases for common dice.
 *
 * Provides the fundamental random roll mechanism used throughout the library.
 *
 * @example
 * import { roll, rollAdv, rollD20 } from "@dice/core";
 *
 * // Roll a d20 normally
 * const result = roll(DieType.D20);
 *
 * // Roll a d20 with advantage
 * const advantage = roll(DieType.D20, RollType.Advantage);
 *
 * // Roll a d6 using shorthand
 * const six = rollD6();
 */

const {
  DieType,
  isValidDieType,
  RollType,
  isValidRollType,
} = require("./entities");
const utils = require("./utils");

/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/RollType").RollTypeValue} RollTypeValue
 */

/**
 * Rolls a single die of the specified type, optionally applying advantage or disadvantage.
 *
 * @function roll
 * @param {DieTypeValue} dieType - The type of die to roll (e.g., `DieType.D20`).
 * @param {RollTypeValue | null} [rollType=null] - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @returns {number} The rolled value (integer between 1 and the die's maximum face).
 * @throws {TypeError} If `dieType` or `rollType` are invalid.
 *
 * @example
 * const result = roll(DieType.D20, RollType.Advantage);
 */
function roll(dieType, rollType = null) {
  // --- Validation ---
  if (!isValidDieType(dieType)) {
    throw new TypeError(`Invalid die type: ${dieType}`);
  }

  if (rollType !== null && !isValidRollType(rollType)) {
    throw new TypeError(`Invalid roll type: ${rollType}`);
  }

  // --- Core Logic ---
  const roll1 = utils.generateResult(dieType);
  if (rollType === null) return roll1;

  const roll2 = utils.generateResult(dieType);
  return rollType === RollType.Advantage
    ? Math.max(roll1, roll2)
    : Math.min(roll1, roll2);
}

//
// --- Convenience Aliases ---
//

/**
 * Rolls a die with advantage.
 * @type {(dieType: DieTypeValue) => number}
 *
 * @example
 * const result = rollAdv(DieType.D10);
 */
const rollAdv = (dieType) => roll(dieType, RollType.Advantage);

/**
 * Rolls a die with disadvantage.
 * @type {(dieType: DieTypeValue) => number}
 *
 * @example
 * const result = rollDis(DieType.D10);
 */
const rollDis = (dieType) => roll(dieType, RollType.Disadvantage);

/**
 * Rolls a D4 die.
 * @type {(rollType?: RollTypeValue | null) => number}
 */
const rollD4 = (rollType = null) => roll(DieType.D4, rollType);

/**
 * Rolls a D6 die.
 * @type {(rollType?: RollTypeValue | null) => number}
 */
const rollD6 = (rollType = null) => roll(DieType.D6, rollType);

/**
 * Rolls a D8 die.
 * @type {(rollType?: RollTypeValue | null) => number}
 */
const rollD8 = (rollType = null) => roll(DieType.D8, rollType);

/**
 * Rolls a D10 die.
 * @type {(rollType?: RollTypeValue | null) => number}
 */
const rollD10 = (rollType = null) => roll(DieType.D10, rollType);

/**
 * Rolls a D12 die.
 * @type {(rollType?: RollTypeValue | null) => number}
 */
const rollD12 = (rollType = null) => roll(DieType.D12, rollType);

/**
 * Rolls a D20 die.
 * @type {(rollType?: RollTypeValue | null) => number}
 */
const rollD20 = (rollType = null) => roll(DieType.D20, rollType);

module.exports = {
  roll,
  rollAdv,
  rollDis,
  rollD4,
  rollD6,
  rollD8,
  rollD10,
  rollD12,
  rollD20,
};
