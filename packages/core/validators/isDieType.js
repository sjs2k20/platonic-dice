/**
 * @module @dice/core/validators/isDieType
 * @description
 * Checks whether a given value is a valid `DieType`.
 */

import { DieType } from "#entities";

/**
 * @param {string | null} dieType
 * @returns {boolean}
 */
export function isDieType(dieType) {
  if (!dieType) return false;
  return Object.values(DieType).includes(dieType);
}
