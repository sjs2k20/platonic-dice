/**
 * Enum for possible roll outcomes.
 *
 * Represents standard success/failure results, including critical cases.
 */
export enum Outcome {
  Success = "success",
  Failure = "failure",
  CriticalSuccess = "critical_success",
  CriticalFailure = "critical_failure",
}

/**
 * Checks whether a given value is a valid {@link Outcome}.
 *
 * @param outcome - The outcome to validate.
 * @returns `true` if valid, otherwise `false`.
 */
export function isValidOutcome(outcome: string | null): boolean;

/** The keys of {@link Outcome} (e.g., `"CriticalSuccess"`). */
export type OutcomeKey = keyof typeof Outcome;

/** The string values of {@link Outcome} (e.g., `"critical_success"`). */
export type OutcomeValue = (typeof Outcome)[OutcomeKey];
