"use strict";
/**
 * @module @dice/core/src/entities/DieType
 * @description
 * Enum for die types used in rolling functions.
 *
 * @readonly
 * @enum {string}
 *
 * @example
 * import { DieType } from "@dice/core/src/entities";
 * const result = roll(DieType.D20);
 */
const DieType = Object.freeze({
  D4: "d4",
  D6: "d6",
  D8: "d8",
  D10: "d10",
  D12: "d12",
  D20: "d20",
});

/**
 * Checks whether a given value is a valid `DieType`.
 *
 * @function isValidDieType
 * @param {DieTypeValue | null | undefined} dieType
 * @returns {boolean}
 */
function isValidDieType(dieType) {
  if (!dieType) return false;
  return Object.values(DieType).includes(dieType);
}

/**
 * @typedef {keyof typeof DieType} DieTypeKey
 * @typedef {typeof DieType[keyof typeof DieType]} DieTypeValue
 */

module.exports = {
  DieType,
  isValidDieType,
};
