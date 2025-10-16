"use strict";
/**
 * @module @dice/core/src/entities/RollType
 * @description
 * Enum for roll modes (normal, advantage, disadvantage).
 *
 * @readonly
 * @enum {string}
 */
const RollType = Object.freeze({
  Advantage: "advantage",
  Disadvantage: "disadvantage",
});

/**
 * Checks whether a given value is a valid `RollType`.
 *
 * @function isValidRollType
 * @param {RollTypeValue | null | undefined} rollType
 * @returns {boolean}
 */
function isValidRollType(rollType) {
  if (!rollType) return false;
  return Object.values(RollType).includes(rollType);
}

/**
 * @typedef {keyof typeof RollType} RollTypeKey
 * @typedef {typeof RollType[keyof typeof RollType]} RollTypeValue
 */

module.exports = {
  RollType,
  isValidRollType,
};
