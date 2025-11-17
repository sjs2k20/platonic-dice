import { DieTypeValue, TestTypeValue } from "./index";

/**
 * Represents a set of validated conditions for a dice roll test.
 *
 * The constructor guarantees that:
 * - `testType` is valid
 * - `conditions` is one of the allowed condition shapes
 * - numeric ranges match the provided die type
 */
export class TestConditions {
  constructor(
    testType: TestTypeValue,
    conditions: Conditions,
    dieType: DieTypeValue
  );

  /** The type of test (e.g., `"at_least"`, `"within"`, `"skill"`). */
  testType: TestTypeValue;

  /** The validated condition object. */
  conditions: Conditions;

  /** The die type associated with the test (e.g., `"d20"`). */
  dieType: DieTypeValue;

  /**
   * Re-validates the stored conditions.
   * Useful after loading from JSON or dynamic sources.
   */
  validate(): void;
}

/**
 * Validates a raw condition object against a given test type.
 */
export function areValidTestConditions(
  c: Record<string, any>,
  testType: TestTypeValue
): boolean;

/**
 * Normalises any input into a {@link TestConditions} instance.
 *
 * Supports:
 * - An existing TestConditions instance → returned unchanged
 * - A plain object → converted to a TestConditions instance
 */
export function normaliseTestConditions(
  tc: TestConditions | { testType: TestTypeValue; [key: string]: any },
  dieType: DieTypeValue
): TestConditions;

/* ------------------------------------------------------------------------- */
/* Internal condition shapes (now accurate to JS and undefined-only policy)  */
/* ------------------------------------------------------------------------- */

interface BaseTestCondition {
  dieType: DieTypeValue;
}

/** target: number */
export interface TargetConditions extends BaseTestCondition {
  target: number;
}

/** target: number + optional critical thresholds */
export interface SkillConditions extends BaseTestCondition {
  target: number;
  critical_success?: number; // optional, undefined if omitted
  critical_failure?: number; // optional, undefined if omitted
}

/** min/max inclusive */
export interface WithinConditions extends BaseTestCondition {
  min: number;
  max: number;
}

/** values: non-empty array */
export interface SpecificListConditions extends BaseTestCondition {
  values: number[];
}

/**
 * Public union of all supported test condition shapes.
 */
export type Conditions =
  | TargetConditions
  | SkillConditions
  | WithinConditions
  | SpecificListConditions;

/** Alias for instances of {@link TestConditions}. */
export type TestConditionsInstance = InstanceType<typeof TestConditions>;
