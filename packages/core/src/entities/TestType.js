"use strict";
/**
 * @module @dice/core/src/entities/TestType
 * @description
 * Enum for test evaluation types (used in {@link TestConditions}).
 *
 * @readonly
 * @enum {string}
 */
const TestType = Object.freeze({
  Exact: "exact", // Must roll exactly this number
  AtLeast: "at_least", // Roll ≥ target
  AtMost: "at_most", // Roll ≤ target
  Within: "within", // Roll within [min, max]
  InList: "in_list", // Roll in array of valid values
  Skill: "skill", // Classic skill/threshold test (with crits)
});

/**
 * Checks whether a given value is a valid `TestType`.
 *
 * @function isValidTestType
 * @param {string | null} testType
 * @returns {boolean}
 */
function isValidTestType(testType) {
  if (!testType) return false;
  return Object.values(TestType).includes(testType);
}

/**
 * @typedef {keyof typeof TestType} TestTypeKey
 * @typedef {typeof TestType[keyof typeof TestType]} TestTypeValue
 */

module.exports = {
  TestType,
  isValidTestType,
};
