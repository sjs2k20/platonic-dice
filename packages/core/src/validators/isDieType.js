/**
 * @module @dice/core/src/validators/isDieType
 * @description
 * Checks whether a given value is a valid `DieType`.
 */

const { DieType } = require("../entities");

/**
 * @param {string | null} dieType
 * @returns {boolean}
 */
function isDieType(dieType) {
  if (!dieType) return false;
  return Object.values(DieType).includes(dieType);
}

module.exports = {
  isDieType,
};
