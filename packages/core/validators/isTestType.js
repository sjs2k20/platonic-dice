import { TestType } from "#entities";

/**
 * @param {string | null} testType - The test type (At least/At most etc.).
 * @returns {boolean} - true if the provided 'value' is a valid TestType.
 */
export function isTestType(testType) {
  if (!testType) return false;
  return Object.values(TestType).includes(testType);
}
