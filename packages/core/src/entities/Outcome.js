/**
 * @module @dice/core/src/entities/Outcome
 * @description
 * Enum for possible roll outcomes.
 *
 * @readonly
 * @enum {string}
 */
const Outcome = Object.freeze({
  Success: "success",
  Failure: "failure",
  Critical_Success: "critical_success",
  Critical_Failure: "critical_failure",
});

/**
 * @typedef {keyof typeof Outcome} OutcomeKey
 * @typedef {typeof Outcome[keyof typeof Outcome]} OutcomeValue
 */

module.exports = {
  Outcome,
};
