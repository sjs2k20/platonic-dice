export type OutcomeKey = keyof typeof Outcome;
export type OutcomeValue = (typeof Outcome)[keyof typeof Outcome];
export type Outcome = string;
/**
 * @module @platonic-dice/core/src/entities/Outcome
 * @description
 * Enum for possible roll outcomes.
 *
 * @readonly
 * @enum {string}
 */
export const Outcome: Readonly<{
    Success: "success";
    Failure: "failure";
    CriticalSuccess: "critical_success";
    CriticalFailure: "critical_failure";
}>;
/**
 * Checks whether a given value is a valid `Outcome`.
 *
 * @function isValidOutcome
 * @param {OutcomeValue | null | undefined} outcome
 * @returns {boolean}
 */
export function isValidOutcome(outcome: OutcomeValue | null | undefined): boolean;
