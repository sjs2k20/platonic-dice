/**
 * @module @dice/core/src/validators/isTestType
 * @description
 * Checks whether a given value is a valid `TestType`.
 */

const { TestType } = require("../entities");

/**
 * @param {string | null} testType
 * @returns {boolean}
 */
function isTestType(testType) {
  if (!testType) return false;
  return Object.values(TestType).includes(testType);
}

module.exports = {
  isTestType,
};
