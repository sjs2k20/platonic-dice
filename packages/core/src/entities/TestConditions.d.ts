import { DieTypeValue, TestTypeValue } from "./index";

/**
 * Represents a set of conditions for a dice roll test.
 *
 * Automatically validates the provided `testType` and `conditions`
 * against the `dieType` when constructed.
 *
 * @example
 * const tc = new TestConditions(TestType.AtLeast, { target: 15 }, DieType.D20);
 * const result = rollTest(DieType.D20, tc);
 */
export class TestConditions {
  /**
   * Creates a validated test condition set.
   *
   * @param testType - The type of test (e.g., `"at_least"`, `"within"`, `"skill"`).
   * @param conditions - The conditions object appropriate to the test type.
   * @param dieType - The die type used to validate numeric ranges.
   * @throws {TypeError|RangeError} If any input is invalid.
   */
  constructor(
    testType: TestTypeValue,
    conditions: object,
    dieType: DieTypeValue
  );

  /** The test type (e.g., `"at_least"`, `"within"`, `"skill"`). */
  testType: TestTypeValue;

  /** The condition values (target, range, thresholds, etc.). */
  conditions: object;

  /** The die type associated with this test (e.g., `"d20"`). */
  dieType: DieTypeValue;

  /**
   * Validates that the current test conditions still conform to the specification.
   * Useful if they are loaded dynamically or serialized.
   *
   * @throws {TypeError} If validation fails.
   */
  validate(): void;
}

/**
 * Validates a given condition object for a specified test type.
 *
 * @param c - The condition object to validate.
 * @param testType - The test type to check against.
 * @returns `true` if valid, `false` otherwise.
 */
export function areValidTestConditions(
  c: Record<string, any>,
  testType: TestTypeValue
): boolean;

/**
 * Normalises any input into a {@link TestConditions} instance.
 *
 * Accepts:
 * - An existing `TestConditions` instance → returned as-is.
 * - A plain object `{ testType, ... }` → wrapped in a new `TestConditions`.
 *
 * Automatically validates all fields using the provided `dieType`.
 *
 * @param tc - A TestConditions instance or plain object.
 * @param dieType - The die type for validation (e.g., `"d6"`, `"d20"`).
 * @returns A validated {@link TestConditions} instance.
 * @throws {TypeError} If input is invalid.
 *
 * @example
 * const tc1 = normaliseTestConditions({ testType: "at_least", target: 4 }, "d6");
 * const tc2 = normaliseTestConditions(new TestConditions("exact", { target: 3 }, "d6"), "d6");
 */
export function normaliseTestConditions(
  tc: TestConditions | { testType: string; [key: string]: any },
  dieType: DieTypeValue
): TestConditions;

/** Alias for instances of {@link TestConditions}. */
export type TestConditionsInstance = InstanceType<typeof TestConditions>;
