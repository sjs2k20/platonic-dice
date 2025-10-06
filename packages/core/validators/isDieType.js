import { DieType } from "#entities";

/**
 * @param {string | null} dieType - Advantage/Disadvantage rolling.
 * @returns {boolean} - true if the provided 'value' is a valid RollType.
 */
export function isDieType(dieType) {
  if (!dieType) return false;
  return Object.values(DieType).includes(dieType);
}
