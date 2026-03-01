export type OutcomeValue = import("../entities/Outcome").OutcomeValue;
export type TestConditionsInstance = import("../entities/TestConditions").TestConditionsInstance;
export type Conditions = import("../entities/TestConditions").Conditions;
export type TestTypeValue = import("../entities/TestType").TestTypeValue;
export type DieTypeValue = import("../entities/DieType").DieTypeValue;
export type TestConditionsLike = import("../entities/TestConditions").TestConditionsLike & {
    dieType: DieTypeValue;
};
/**
 * @typedef {import("../entities/Outcome").OutcomeValue} OutcomeValue
 * @typedef {import("../entities/TestConditions").TestConditionsInstance} TestConditionsInstance
 * @typedef {import("../entities/TestConditions").Conditions} Conditions
 * @typedef {import("../entities/TestType").TestTypeValue} TestTypeValue
 * @typedef {import("../entities/DieType").DieTypeValue} DieTypeValue
 */
/**
 * @private
 * @typedef {import("../entities/TestConditions").TestConditionsLike & { dieType: DieTypeValue }} TestConditionsLike
 */
/**
 * Determines the outcome of a roll based on provided {@link TestConditions}.
 * Returns standard {@link Outcome} values including success, failure, and criticals.
 *
 * @function determineOutcome
 * @param {number} value - The rolled (possibly modified) result.
 * @param {TestConditionsInstance|TestConditionsLike} testConditions - The conditions defining success/failure thresholds.
 * @returns {OutcomeValue} The resulting outcome.
 * @throws {TypeError} If the provided conditions or test type are invalid.
 *
 * @example
 * const test = new TestConditions(TestType.AtLeast, { target: 12 });
 * const outcome = determineOutcome(14, test);
 * console.log(outcome); // "success"
 *
 * @example
 * const skill = new TestConditions(TestType.Skill, {
 *   target: 10,
 *   critical_success: 20,
 *   critical_failure: 1
 * });
 * console.log(determineOutcome(1, skill)); // "critical_failure"
 */
export function determineOutcome(value: number, testConditions: TestConditionsInstance | TestConditionsLike): OutcomeValue;
