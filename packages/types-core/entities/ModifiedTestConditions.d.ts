/**
 * @module @platonic-dice/core/src/entities/ModifiedTestConditions
 */

import type { DieTypeValue } from "./DieType";
import type { TestTypeValue } from "./TestType";
import type {
  RollModifierFunction,
  RollModifierInstance,
} from "./RollModifier";

/**
 * Represents test conditions for modified rolls, where the achievable range
 * is determined by both the base die type and the applied modifier.
 *
 * Unlike {@link TestConditions}, this class validates targets against the
 * **modified range** rather than just the base die faces.
 */
export class ModifiedTestConditions {
  testType: TestTypeValue;
  conditions: Conditions;
  dieType: DieTypeValue;
  modifier: RollModifierInstance;
  modifiedRange: { min: number; max: number };

  /**
   * @param testType - The test type.
   * @param conditions - The test conditions object.
   * @param dieType - The base die type.
   * @param modifier - The modifier to apply.
   * @throws {TypeError|RangeError} If the test type or conditions are invalid.
   */
  constructor(
    testType: TestTypeValue,
    conditions: Conditions,
    dieType: DieTypeValue,
    modifier: RollModifierFunction | RollModifierInstance
  );

  /**
   * Validates that the test conditions still conform to spec.
   * @throws {TypeError} If the test conditions are invalid.
   */
  validate(): void;
}

/**
 * Validates test conditions against a modified range.
 *
 * @param c - Conditions with modifiedRange
 * @param testType - The test type
 * @returns `true` if valid, otherwise `false`
 */
export function areValidModifiedTestConditions(
  c: Record<string, any>,
  testType: TestTypeValue
): boolean;

/**
 * Computes the achievable range for a die + modifier combination.
 *
 * @param dieType - The base die type
 * @param modifier - The modifier instance
 * @returns The min and max achievable values
 */
export function computeModifiedRange(
  dieType: DieTypeValue,
  modifier: RollModifierInstance
): { min: number; max: number };

/** Base test condition structure */
export interface BaseTestCondition {
  modifiedRange: { min: number; max: number };
}

/** Target-based conditions (AtLeast, AtMost, Exact) */
export interface TargetConditions extends BaseTestCondition {
  target: number;
}

/** Range-based conditions (Within) */
export interface WithinConditions extends BaseTestCondition {
  min: number;
  max: number;
}

/** List-based conditions (InList) */
export interface SpecificListConditions extends BaseTestCondition {
  values: number[];
}

/** Skill test conditions with optional critical thresholds */
export interface SkillConditions extends BaseTestCondition {
  target: number;
  critical_success?: number;
  critical_failure?: number;
}

/** Union of all possible condition types */
export type Conditions =
  | TargetConditions
  | SkillConditions
  | WithinConditions
  | SpecificListConditions;

/** Instance type of ModifiedTestConditions */
export type ModifiedTestConditionsInstance = InstanceType<
  typeof ModifiedTestConditions
>;
