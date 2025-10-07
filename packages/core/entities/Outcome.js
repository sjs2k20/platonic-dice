/**
 * @module @dice/core/entities/Outcome
 * @description
 * Enum for possible roll outcomes.
 *
 * @readonly
 * @enum {string}
 */
export const Outcome = Object.freeze({
  Success: "success",
  Failure: "failure",
  Critical_Success: "critical_success",
  Critical_Failure: "critical_failure",
});

/**
 * @typedef {keyof typeof Outcome} OutcomeKey
 * @typedef {typeof Outcome[keyof typeof Outcome]} OutcomeValue
 */
