/**
 * @module @dice/core/validators/isTestType
 * @description
 * Checks whether a given value is a valid `TestType`.
 */

import { TestType } from "#entities";

/**
 * @param {string | null} testType
 * @returns {boolean}
 */
export function isTestType(testType) {
  if (!testType) return false;
  return Object.values(TestType).includes(testType);
}
