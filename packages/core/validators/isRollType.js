import { RollType } from "#entities";

/**
 * @param {string | null} rollType - Advantage/Disadvantage rolling.
 * @returns {boolean} - true if the provided 'value' is a valid RollType.
 */
export function isRollType(rollType) {
  if (!rollType) return false;
  return Object.values(RollType).includes(rollType);
}
