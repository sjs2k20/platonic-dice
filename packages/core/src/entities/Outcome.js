"use strict";
/**
 * @module @platonic-dice/core/src/entities/Outcome
 * @description
 * Enum for possible roll outcomes.
 *
 * @readonly
 * @enum {string}
 */
const Outcome = Object.freeze({
  Success: "success",
  Failure: "failure",
  CriticalSuccess: "critical_success",
  CriticalFailure: "critical_failure",
});

/**
 * Checks whether a given value is a valid `Outcome`.
 *
 * @function isValidOutcome
 * @param {OutcomeValue | null | undefined} outcome
 * @returns {boolean}
 */
function isValidOutcome(outcome) {
  if (!outcome) return false;
  return Object.values(Outcome).includes(outcome);
}

/**
 * @typedef {keyof typeof Outcome} OutcomeKey
 * @typedef {typeof Outcome[keyof typeof Outcome]} OutcomeValue
 */

module.exports = {
  Outcome,
  isValidOutcome,
};
