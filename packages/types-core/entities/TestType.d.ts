/**
 * Enum for test evaluation types.
 *
 * Defines how a roll is compared against its conditions in `TestConditions`.
 */
export enum TestType {
  Exact = "exact",
  AtLeast = "at_least",
  AtMost = "at_most",
  Within = "within",
  InList = "in_list",
  Skill = "skill",
}

export function isValidTestType(testType?: string): boolean;

export type TestTypeKey = keyof typeof TestType;
export type TestTypeValue = (typeof TestType)[TestTypeKey];
