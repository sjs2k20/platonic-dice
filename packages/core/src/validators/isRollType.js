/**
 * @module @dice/core/src/validators/isRollType
 * @description
 * Checks whether a given value is a valid `RollType`.
 */

import { RollType } from "#entities";

/**
 * @param {string | null} rollType
 * @returns {boolean}
 */
export function isRollType(rollType) {
  if (!rollType) return false;
  return Object.values(RollType).includes(rollType);
}
