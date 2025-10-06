import { roll } from "./roll.js";
import {
  DieType,
  RollType,
  TestConditions,
  TestType,
  Outcome,
} from "#entities";

/**
 * Rolls a die and evaluates it against a set of test conditions.
 *
 * Supports passing either a TestConditions instance or a plain object:
 * `{ testType: TestType, ...conditions }`.
 *
 * @function rollTest
 * @param {DieType} dieType - The die type to roll (e.g., 'd6', 'd20').
 * @param {TestConditions|object} testConditions - The conditions object to evaluate the roll against.
 * @param {RollType} [rollType=null] - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @returns {{ base: number, outcome: Outcome }} The raw roll and the resulting outcome.
 * @throws {TypeError} If dieType or testConditions are invalid.
 *
 * @example
 * const test = new TestConditions(TestType.AtLeast, { target: 15 });
 * const result = rollTest(DieType.D20, test);
 * console.log(result); // { base: 12, outcome: 'failure' }
 *
 * @example
 * const skillTest = new TestConditions(TestType.Skill, { target: 12, critical_success: 20, critical_failure: 1 });
 * const result = rollTest(DieType.D20, skillTest);
 * console.log(result); // { base: 20, outcome: 'critical_success' }
 *
 * @example
 * // Using a plain object instead of TestConditions
 * const result = rollTest(DieType.D20, { testType: TestType.AtLeast, target: 10 });
 * console.log(result); // { base: 14, outcome: 'success' }
 */
export function rollTest(dieType, testConditions, rollType = null) {
  if (!dieType) throw new TypeError("dieType is required.");

  // Allow passing a plain object or TestConditions instance
  if (!(testConditions instanceof TestConditions)) {
    const { testType, ...conditions } = testConditions;
    testConditions = new TestConditions(testType, conditions);
  }

  // Validate conditions against the die type
  testConditions.validate(dieType);

  // Roll the die
  const base = roll(dieType, rollType);
  const { testType, conditions } = testConditions;

  let outcome;

  switch (testType) {
    case TestType.AtLeast:
      outcome = base >= conditions.target ? Outcome.Success : Outcome.Failure;
      break;

    case TestType.AtMost:
      outcome = base <= conditions.target ? Outcome.Success : Outcome.Failure;
      break;

    case TestType.Exact:
      outcome = base === conditions.target ? Outcome.Success : Outcome.Failure;
      break;

    case TestType.Within:
      outcome =
        base >= conditions.min && base <= conditions.max
          ? Outcome.Success
          : Outcome.Failure;
      break;

    case TestType.InList:
      outcome = conditions.values.includes(base)
        ? Outcome.Success
        : Outcome.Failure;
      break;

    case TestType.Skill:
      if (
        conditions.critical_failure != null &&
        base <= conditions.critical_failure
      ) {
        outcome = Outcome.Critical_Failure;
      } else if (
        conditions.critical_success != null &&
        base >= conditions.critical_success
      ) {
        outcome = Outcome.Critical_Success;
      } else {
        outcome = base >= conditions.target ? Outcome.Success : Outcome.Failure;
      }
      break;

    case TestType.Odd:
      outcome = base % 2 === 1 ? Outcome.Success : Outcome.Failure;
      break;

    case TestType.Even:
      outcome = base % 2 === 0 ? Outcome.Success : Outcome.Failure;
      break;

    default:
      throw new TypeError(`Unknown testType '${testType}'.`);
  }

  return { base, outcome };
}
