import { OutcomeValue, TestConditionsInstance } from "../entities";

/**
 * Determines the outcome of a roll given its value and test conditions.
 *
 * @param value - The rolled result (possibly modified).
 * @param testConditions - A {@link TestConditionsInstance} or plain object
 *   defining the test parameters (e.g. `{ testType, target }`).
 * @returns The resulting outcome as an {@link OutcomeValue}.
 * @throws {TypeError} If the provided conditions or test type are invalid.
 *
 * @example
 * const test = new TestConditions(TestType.AtLeast, { target: 15 });
 * const outcome = determineOutcome(18, test);
 * console.log(outcome); // "success"
 */
export function determineOutcome(
  value: number,
  testConditions:
    | TestConditionsInstance
    | import("../entities/TestConditions").TestConditionsLike,
): OutcomeValue;
