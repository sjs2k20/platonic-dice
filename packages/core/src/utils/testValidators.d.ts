/**
 * Type declarations for test validators used by core utilities.
 */
import { DieTypeValue } from "../entities/DieType";
import { TestTypeValue } from "../entities/TestType";

export interface BaseTestCondition {
  dieType: DieTypeValue;
}

export interface TargetConditions extends BaseTestCondition {
  target: number;
}

export interface WithinConditions extends BaseTestCondition {
  min: number;
  max: number;
}

export interface SpecificListConditions extends BaseTestCondition {
  values: number[];
}

export interface SkillConditions extends BaseTestCondition {
  target: number;
  critical_success?: number;
  critical_failure?: number;
}

export type Conditions =
  | TargetConditions
  | SkillConditions
  | WithinConditions
  | SpecificListConditions;

export type PlainObject = Record<string, unknown>;
export type ConditionsLike = Conditions | PlainObject;

export function isValidFaceValue(n: number, sides: number): boolean;
export function areValidFaceValues<T extends Record<string, any>>(
  obj: T,
  sides: number,
  keys: Array<keyof T>
): boolean;
// Accepts a thresholds-like object { target, critical_success?, critical_failure? }
export function isValidThresholdOrder(thresholds: Record<string, any>): boolean;

// The runtime validators accept a single conditions-like object and derive
// die sides internally (via `numSides`), so these declarations reflect that.
export function isValidTargetConditions(c: Record<string, any>): boolean;
export function isValidSkillTestCondition(c: Record<string, any>): boolean;
export function isValidWithinConditions(c: Record<string, any>): boolean;
export function isValidSpecificListConditions(c: Record<string, any>): boolean;
export function areValidTestConditions(
  c: Record<string, any>,
  testType: TestTypeValue | string
): boolean;
export function areValidValuesInRange(
  obj: Record<string, any>,
  min: number,
  max: number,
  keys: string[]
): boolean;
