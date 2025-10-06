import { Outcome } from "#root";

/**
 * Evaluates a single roll result against test conditions.
 *
 * @param {number} value - The rolled (possibly modified) result.
 * @param {Object} conditions - Outcome evaluation conditions.
 * @param {number} conditions.target - Minimum roll required for success.
 * @param {number} [conditions.critical_success] - Rolls >= this count as critical success.
 * @param {number} [conditions.critical_failure] - Rolls <= this count as critical failure.
 * @returns {Outcome} The resulting outcome.
 */
export function determineOutcome(value, conditions) {
  const { target, critical_success, critical_failure, targets } = conditions;
  if (Array.isArray(targets)) {
    return targets.includes(value) ? Outcome.Success : Outcome.Failure;
  }

  if (critical_success !== undefined && value >= critical_success) {
    return Outcome.Critical_Success;
  }

  if (critical_failure !== undefined && value <= critical_failure) {
    return Outcome.Critical_Failure;
  }

  if (target !== undefined) {
    return value >= target ? Outcome.Success : Outcome.Failure;
  }

  throw new Error("No valid outcome conditions provided.");
}
