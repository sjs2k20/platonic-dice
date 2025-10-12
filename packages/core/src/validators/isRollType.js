/**
 * @module @dice/core/src/validators/isRollType
 * @description
 * Checks whether a given value is a valid `RollType`.
 */

const { RollType } = require("../entities");

/**
 * @param {string | null} rollType
 * @returns {boolean}
 */
function isRollType(rollType) {
  if (!rollType) return false;
  return Object.values(RollType).includes(rollType);
}

module.exports = {
  isRollType,
};
